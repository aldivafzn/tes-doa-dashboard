import { Injectable, Logger } from '@nestjs/common';
import { google, docs_v1 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as tmp from 'tmp';
import os from 'os';
import path from 'path';

@Injectable()
export class GoogleApiService {
  private auth = new google.auth.GoogleAuth({
    keyFile: '../Backend/gmf-doa-dev-gdriveapi.json',
    scopes: [
      'https://www.googleapis.com/auth/documents',
      'https://www.googleapis.com/auth/drive',
    ],
  });

  private logger = new Logger(GoogleApiService.name);

  private async getAuthClient(): Promise<OAuth2Client> {
    const client = await this.auth.getClient();
    if (client instanceof OAuth2Client) {
      return client;
    } else {
      throw new Error('Auth client is not an instance of OAuth2Client');
    }
  }

  async replaceTextInGoogleDocs(
    documentId: string,
    findText: string,
    replaceText: string,
  ): Promise<docs_v1.Schema$BatchUpdateDocumentResponse> {
    try {
      const authClient = await this.getAuthClient();
      const docs = google.docs({ version: 'v1', auth: authClient });

      const response = await docs.documents.batchUpdate({
        documentId,
        requestBody: {
          requests: [
            {
              replaceAllText: {
                containsText: {
                  text: findText,
                  matchCase: true,
                },
                replaceText,
              },
            },
          ],
        },
      });

      return response.data;
    } catch (error) {
      this.logger.error('Error replacing text in Google Docs:', error.message);
      throw error;
    }
  }

  async copyGoogleDoc(
    sourceDocumentId: string,
    copyTitle: string,
    emailAddress: string,
  ): Promise<string> {
    try {
      const authClient = await this.getAuthClient();
      const drive = google.drive({ version: 'v3', auth: authClient });

      const originalFile = await drive.files.get({
        fileId: sourceDocumentId,
        fields: 'parents',
      });

      const parents = originalFile.data.parents || [];

      const response = await drive.files.copy({
        fileId: sourceDocumentId,
        requestBody: {
          name: copyTitle,
          parents,
        },
      });

      const copiedDocumentId = response.data.id;

      await drive.permissions.create({
        fileId: copiedDocumentId,
        requestBody: {
          role: 'writer',
          type: 'user',
          emailAddress,
        },
      });

      return copiedDocumentId;
    } catch (error) {
      this.logger.error('Error copying Google Doc:', error.message);
      throw error;
    }
  }

  async moveFileToFolder(fileId: string, newParentId: string): Promise<void> {
    try {
      const authClient = await this.getAuthClient();
      const drive = google.drive({ version: 'v3', auth: authClient });

      const fileMetadata = await drive.files.get({
        fileId,
        fields: 'parents',
      });

      const previousParents = fileMetadata.data.parents?.join(',') || '';

      await drive.files.update({
        fileId,
        addParents: newParentId,
        removeParents: previousParents,
        fields: 'id, parents',
      });

      this.logger.log(`File ID: ${fileId} moved to folder ID: ${newParentId}`);
    } catch (error) {
      this.logger.error('Error moving file to folder:', error.message);
      throw error;
    }
  }

  async getPDF(
    documentId: string,
  ): Promise<{ success: boolean; path: string }> {
    const outputLocationPath = path.join(
      os.homedir(),
      'Downloads',
      `${documentId}.pdf`,
    );

    try {
      const fileContent = await this.exportPdf(documentId);
      const dest = fs.createWriteStream(outputLocationPath);

      return new Promise((resolve, reject) => {
        fileContent.pipe(dest);
        dest.on('finish', () => {
          this.logger.log('Download Completed');
          resolve({ success: true, path: outputLocationPath });
        });
        dest.on('error', (err) => {
          this.logger.error('Error writing file:', err.message);
          reject({ success: false, message: 'Error in writing file' });
        });
      });
    } catch (error) {
      this.logger.error('Error during file export:', error.message);
      throw { success: false, message: 'Error during file export' };
    }
  }

  async getPDFDrive(
    documentId: string,
    parentFolderId: string,
  ): Promise<{ status: number; message: string }> {
    try {
      const fileContent = await this.exportPdf(documentId);

      const tmpFile = tmp.fileSync({ postfix: '.pdf' });
      const dest = fs.createWriteStream(tmpFile.name);

      await new Promise<void>((resolve, reject) => {
        fileContent.pipe(dest);
        dest.on('finish', resolve);
        dest.on('error', reject);
      });

      const fileMetadata = {
        name: `${documentId}.pdf`,
        mimeType: 'application/pdf',
        parents: [parentFolderId],
      };

      const authClient = await this.getAuthClient();
      const driveService = google.drive({
        version: 'v3',
        auth: authClient,
      });

      const response = await driveService.files.create({
        requestBody: fileMetadata,
        media: {
          mimeType: 'application/pdf',
          body: fs.createReadStream(tmpFile.name),
        },
        fields: 'id',
      });

      tmpFile.removeCallback();

      const fileLink = `https://drive.google.com/file/d/${response.data.id}/view?usp=sharing`;
      return { status: 200, message: fileLink };
    } catch (error) {
      this.logger.error('Error during file export or upload:', error.message);
      throw { success: false, message: 'Error during file export or upload' };
    }
  }

  private async exportPdf(documentId: string): Promise<Readable> {
    const authClient = await this.getAuthClient();
    const drive = google.drive({ version: 'v3', auth: authClient });

    const response = await drive.files.export(
      {
        fileId: documentId,
        mimeType: 'application/pdf',
      },
      { responseType: 'stream' },
    );

    return response.data as Readable;
  }
}
