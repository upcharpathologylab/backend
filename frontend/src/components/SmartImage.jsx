import { Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { assetUrl } from "../api/api.js";

function SmartImage({ src, alt, className = "", fallbackClassName = "", children }) {
  const [failed, setFailed] = useState(false);
  const imageSrc = assetUrl(src);

  if (!imageSrc || failed) {
    return (
      <div
        className={`flex h-full min-h-[160px] w-full items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 ${fallbackClassName}`}
      >
        <div className="flex flex-col items-center gap-2 text-navy-500">
          <ImageIcon className="h-8 w-8" />
          <span className="text-xs font-bold">{alt}</span>
        </div>
        {children}
      </div>
    );
  }

  return <img src={imageSrc} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />;
}

export default SmartImage;
