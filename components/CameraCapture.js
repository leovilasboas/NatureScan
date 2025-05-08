import { useState, useRef, useEffect } from 'react';

export default function CameraCapture({ onImageCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Initialize camera when component mounts
  useEffect(() => {
    checkCameraAvailability();
    
    // Cleanup function to stop stream when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  const checkCameraAvailability = async () => {
    try {
      // Just check if we can enumerate devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setHasCamera(videoDevices.length > 0);
    } catch (err) {
      console.error("Error checking camera availability:", err);
      setHasCamera(false);
      setError("Unable to detect camera devices. Please ensure you have granted camera permissions.");
    }
  };

  const startCamera = async () => {
    setError(null);
    setIsCapturing(true);
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsCameraActive(true);
          setIsCapturing(false);
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setIsCapturing(false);
      
      if (err.name === 'NotAllowedError') {
        setError("Camera access denied. Please allow camera access in your browser settings.");
      } else if (err.name === 'NotFoundError') {
        setError("No camera found. Please make sure your device has a camera.");
        setHasCamera(false);
      } else {
        setError(`Error accessing camera: ${err.message}`);
      }
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data URL
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageDataUrl);
    onImageCapture(imageDataUrl);
    
    // Stop the camera stream
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
      setIsCameraActive(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    onImageCapture(null);
    startCamera();
  };

  return (
    <div className="w-full">
      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg">
          <p>{error}</p>
        </div>
      )}
      
      {!hasCamera && (
        <div className="p-4 mb-4 bg-yellow-100 text-yellow-700 rounded-lg">
          <p>No camera detected or camera access is not available in this browser. Please use the image upload option instead.</p>
        </div>
      )}
      
      {capturedImage ? (
        <div className="mb-4">
          <div className="relative">
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full h-64 object-contain border rounded-lg" 
            />
            <button
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              onClick={retakePhoto}
              aria-label="Retake photo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden h-64 bg-black relative">
          {isCameraActive ? (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                playsInline
                autoPlay
              ></video>
              <button
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full w-16 h-16 flex items-center justify-center border-4 border-gray-300 focus:outline-none"
                onClick={captureImage}
              >
                <div className="w-12 h-12 rounded-full bg-red-500"></div>
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              {isCapturing ? (
                <div className="flex flex-col items-center">
                  <svg className="animate-spin h-10 w-10 text-white mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-white">Accessing camera...</p>
                </div>
              ) : (
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  onClick={startCamera}
                  disabled={!hasCamera || isCapturing}
                >
                  <div className="flex items-center">
                    <img src="/icons/camera.svg" alt="Camera" className="w-5 h-5 mr-2" />
                    Start Camera
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Hidden canvas for capturing images */}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}
