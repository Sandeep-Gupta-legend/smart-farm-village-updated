import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, Camera, MicOff, CameraOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// Gemini AI mock integration
function geminiAI(query: string, imageBlob?: Blob): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (imageBlob) {
        resolve('Gemini AI: Image search result for farming tools');
      } else {
        resolve(`Gemini AI: Search result for "${query}"`);
      }
    }, 1200);
  });
}

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string, imageBlob?: Blob) => void;
  className?: string;
  showCamera?: boolean;
  showMic?: boolean;
  showGeminiResult?: boolean;
  enableMic?: boolean;
  enableCamera?: boolean;
  enableStorage?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  onSearch,
  className = "",
  showCamera = true,
  showMic = true,
  showGeminiResult = false,
  enableMic = true,
  enableCamera = true,
  enableStorage = true
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [aiResult, setAiResult] = useState<string>("");

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        onSearch(transcript);
        setIsListening(false);
        toast.success('Voice search completed');
      };
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Voice recognition failed. Please try again.');
      };
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      setRecognition(recognitionInstance);
    }
  }, [onSearch]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    onSearch(query);
    // Call Gemini AI for text
    if (showGeminiResult) {
      const result = await geminiAI(query);
      setAiResult(result);
    }
  };

  const handleVoiceSearch = () => {
    if (!recognition) {
      toast.error('Voice recognition not supported in this browser');
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      toast.info('Listening... Speak now');
    }
  };

  const handleCameraSearch = () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      toast.info('Camera activated. Take a photo to search');
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            processImage(blob);
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const processImage = async (imageBlob: Blob) => {
    try {
      toast.info('Processing image with Gemini AI...');
      onSearch(searchQuery, imageBlob);
      stopCamera();
      toast.success('Image processed! Gemini AI result updated.');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image. Please try again.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageBlob = new Blob([e.target?.result as ArrayBuffer], { type: file.type });
        processImage(imageBlob);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
    setAiResult("");
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className={`search-container relative ${className}`}>
      <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
        <Search className="w-5 h-5 text-gray-400 ml-3" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="border-none bg-transparent flex-1 focus:ring-0 text-gray-700"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="p-2 hover:bg-gray-100"
          >
            <X className="w-4 h-4 text-gray-400" />
          </Button>
        )}
  {(showMic || enableMic) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVoiceSearch}
            className={`p-2 hover:bg-gray-100 ${isListening ? 'bg-red-100 text-red-600' : ''}`}
            disabled={!recognition}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>
        )}
  {(showCamera || enableCamera) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCameraSearch}
            className={`p-2 hover:bg-gray-100 ${isCameraActive ? 'bg-blue-100 text-blue-600' : ''}`}
          >
            {isCameraActive ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
          </Button>
        )}
      </div>
      {/* Gemini AI Result Display */}
      {aiResult && showGeminiResult && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
          <strong>Gemini AI:</strong> {aiResult}
        </div>
      )}
      {/* Camera Modal */}
      {isCameraActive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Camera Search</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={stopCamera}
                className="p-1"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 bg-gray-100 rounded-lg object-cover"
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={capturePhoto}
                className="flex-1"
              >
                Capture Photo
              </Button>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                Upload Image
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      )}
      {/* Voice Status Indicator */}
      {isListening && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-red-100 border border-red-200 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-2 text-red-600">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Listening... Speak now</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;


