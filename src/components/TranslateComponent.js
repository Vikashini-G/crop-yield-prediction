// import React, { useEffect, useRef } from "react";

// const TranslateComponent = () => {
//   const googleTranslateRef = useRef(null);

//   useEffect(() => {
//     let intervalId = null;
//     const checkGoogleTranslate = () => {
//       if (window.google && window.google.translate && window.google.translate.TranslateElement.InlineLayout) {
//         clearInterval(intervalId);
//         new window.google.translate.TranslateElement(
//           {
//             pageLanguage: "en",
//             includedLanguages: "en,ta,te,kn,hi",
//             layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL
//           },
//           googleTranslateRef.current
//         );
//       }
//     };
//     intervalId = setInterval(checkGoogleTranslate, 100);
//     return () => clearInterval(intervalId);
//   }, []);

//   return (
//     <div>
//       <div ref={googleTranslateRef}></div>
//     </div>
//   );
// };

// export default TranslateComponent;

import React, { useEffect, useRef } from "react";

const TranslateComponent = () => {
  const googleTranslateRef = useRef(null);

  useEffect(() => {
    // Define the googleTranslateElementInit function
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,ta,te,kn,hi", // Add desired languages
          layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL,
        },
        googleTranslateRef.current
      );
    };

    // Create and add the Google Translate script
    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup the script when component unmounts
    return () => {
      document.body.removeChild(script);
      delete window.googleTranslateElementInit;
    };
  }, []);

  return <div ref={googleTranslateRef}></div>;
};

export default TranslateComponent;
