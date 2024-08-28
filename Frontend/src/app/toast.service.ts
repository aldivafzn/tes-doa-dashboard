// toast.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor() {}

  successToast(message: string) {
    const toastContainer = document.createElement('div');
    toastContainer.innerHTML = `
      <div class="z-50 fixed top-28 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <div id="toast-success" class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-lg border" role="alert">
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                </svg>
                <span class="sr-only">Check icon</span>
            </div>
            <div class="ms-3 text-sm font-medium">${message}</div>
        </div>
      </div>
    `;
    document.body.appendChild(toastContainer);
    setTimeout(() => {
      document.body.removeChild(toastContainer);
    }, 2000);
  }

  failedToast(message: string) {
    const toastContainer = document.createElement('div');
    toastContainer.innerHTML = `
      <div class="z-50 fixed top-28 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <div id="toast-danger" class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-lg border role="alert">
          <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
            </svg>
            <span class="sr-only">Error icon</span>
          </div>
          <div class="ms-3 text-sm font-medium">${message}</div>
        </div>
      </div>
    `;
    document.body.appendChild(toastContainer);
    setTimeout(() => {
      document.body.removeChild(toastContainer);
    }, 2000);
  }

  generatingToast(message: string) {
    const toastContainer = document.createElement('div');
    toastContainer.innerHTML = `
      <div class="z-50 fixed top-28 left-1/2 transform -translate-x-1/2 flex flex-col items-center" id="generating-toast">
        <div class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-lg border" role="alert">
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-gray-500 bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-gray-200">
                <svg class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                <span class="sr-only">Loading icon</span>
            </div>
            <div class="ms-3 text-sm font-medium">${message}</div>
        </div>
      </div>
    `;
    document.body.appendChild(toastContainer);
    return toastContainer;
  }
  
  
}