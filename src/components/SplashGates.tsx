<video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop={false} // Changed from {!isPlaying} to false
          muted={!isPlaying}
          playsInline
          webkit-playsinline="true"
          onEnded={handleEnded}
          onError={(e) => {
            console.error("Gates video load failed. Highlighting fallback transitioning.", e);
            setVideoError(true);
            handleEnded();
          }}
        >
          <source src={getAssetUrl("gates.mp4")} type="video/mp4" />
          <source src={getAssetUrl("Gates.mp4")} type="video/mp4" />
        </video>
