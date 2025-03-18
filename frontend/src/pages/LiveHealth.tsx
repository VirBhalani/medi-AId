import { useState } from 'react';
import { motion } from 'framer-motion';

const LiveHealth = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full h-full"
        >
          <iframe 
            src="https://labs.heygen.com/guest/streaming-embed?share=eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiJBbm5fRG9jdG9yX1NpdHRpbmdfcHVibGlj%0D%0AIiwicHJldmlld0ltZyI6Imh0dHBzOi8vZmlsZXMyLmhleWdlbi5haS9hdmF0YXIvdjMvMjZkZTM2%0D%0AOWIyZDQ0NDNlNTg2ZGVkZjI3YWYxZTBjMWRfNDU1NzAvcHJldmlld190YWxrXzEud2VicCIsIm5l%0D%0AZWRSZW1vdmVCYWNrZ3JvdW5kIjpmYWxzZSwia25vd2xlZGdlQmFzZUlkIjoiMzE3NWU1MTRlZjhj%0D%0ANDVkY2I0MjE3MmExZTA0MjY2ZDkiLCJ1c2VybmFtZSI6IjliOTNiNWI1MzM2YjQ1Yzc5ZDU2NjY4%0D%0AMWM1YjQ4Y2Y3In0%3D&inIFrame=1"
            allow="microphone"
            allowFullScreen
            className="w-full h-full border-none"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default LiveHealth; 