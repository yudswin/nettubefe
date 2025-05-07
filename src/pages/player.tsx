import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Hls from 'hls.js';
import { StreamingService } from "../services/streaming.service";
import { useLanguage } from "@contexts/LanguageContext";

const Player = () => {
    const { mediaId } = useParams<{ mediaId: string }>();
    const [hlsUrl, setHlsUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const videoRef = useRef<HTMLVideoElement>(null);
    const { t } = useLanguage()
    const navigate = useNavigate()


    useEffect(() => {
        const fetchVideo = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await StreamingService.getStream(mediaId!);

                if (response.status === 'success') {
                    setHlsUrl(response.result.hls);
                } else {
                    setError(response.error || "Failed to load video stream");
                }
            } catch (err) {
                setError("Network error. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (mediaId) {
            fetchVideo();
        }
    }, [mediaId]);

    useEffect(() => {
        if (hlsUrl && videoRef.current) {
            const video = videoRef.current;

            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(hlsUrl);
                hls.attachMedia(video);

                return () => {
                    hls.destroy();
                };
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = hlsUrl;
            }
        }
    }, [hlsUrl]);

    return (
        <div className="relative h-screen w-full bg-black">
            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-netflix-red border-t-transparent"></div>
                        <p className="text-lg text-white">Loading stream...</p>
                    </div>
                </div>
            )}

            {/* Error Overlay */}
            {error && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90">
                    <div className="text-center">
                        <h2 className="mb-4 text-2xl font-bold text-netflix-red">Playback Error</h2>
                        <p className="text-lg text-white">{error}</p>
                        <p className="mt-2 text-gray-400">Media ID: {mediaId}</p>
                    </div>
                </div>
            )}

            {/* Video Container */}
            {!loading && !error && hlsUrl && (
                <div className="relative h-full w-full">
                    <video
                        ref={videoRef}
                        controls={true}
                        autoPlay
                        className="h-full w-full object-cover"
                    />

                    {/* Center Play/Pause Button */}
                    <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition hover:bg-white/20">
                            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            </svg>
                        </div>
                    </button>
                </div>
            )}

            {/* Selft Logo in Corner */}
            <button onClick={() => {
                navigate(-1)
            }} className="btn bg-transparent border-0 shadow-none  text-2xl absolute left-8 top-8 z-50 font-bold text-amber-500">{t.appName}</button>

        </div>
    );
};

export default Player;