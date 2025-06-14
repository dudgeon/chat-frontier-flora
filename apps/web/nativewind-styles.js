// Inject NativeWind styles directly into the DOM
export const injectNativeWindStyles = () => {
  if (typeof document !== 'undefined') {
    const existingStyle = document.getElementById('nativewind-styles');
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = 'nativewind-styles';
      style.textContent = `
        .bg-green-500 {
          --tw-bg-opacity: 1;
          background-color: rgb(34 197 94 / var(--tw-bg-opacity, 1)) !important;
        }
        
        .text-white {
          --tw-text-opacity: 1;
          color: rgb(255 255 255 / var(--tw-text-opacity, 1)) !important;
        }
        
        .rounded-lg {
          border-radius: 0.5rem !important;
        }
        
        .px-4 {
          padding-left: 1rem !important;
          padding-right: 1rem !important;
        }
        
        .py-3 {
          padding-top: 0.75rem !important;
          padding-bottom: 0.75rem !important;
        }
        
        .my-2 {
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
        }
        
        .items-end {
          align-items: flex-end !important;
        }
        
        .max-w-\\[80\\%\\] {
          max-width: 80% !important;
        }
        
        .min-w-\\[60px\\] {
          min-width: 60px !important;
        }
        
        .rounded-tr-sm {
          border-top-right-radius: 0.125rem !important;
        }
        
        .text-base {
          font-size: 1rem !important;
          line-height: 1.5rem !important;
        }
        
        .leading-6 {
          line-height: 1.5rem !important;
        }
      `;
      document.head.appendChild(style);
      console.log('✅ NativeWind styles injected successfully');
    }
  }
};