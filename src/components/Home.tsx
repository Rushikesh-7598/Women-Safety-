import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import "./Home.css";

const Home: React.FC = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const handleEmergency = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setShowCard(true);

          try {
            // ✅ Record a 10-second video with sound
            const videoFile = await recordVideo();

            // ✅ Send data to backend
            const formData = new FormData();
            formData.append("latitude", latitude.toString());
            formData.append("longitude", longitude.toString());
            formData.append("video", videoFile);

            const response = await fetch("http://localhost:5000/api/emergency", {
              method: "POST",
              body: formData,
            });

            if (response.ok) {
              console.log("✅ Emergency alert sent successfully!");
            } else {
              console.error("❌ Failed to send emergency alert.");
            }
          } catch (error) {
            console.error("❌ Error:", error);
          }
        },
        (error) => {
          alert("Error getting location: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }

    
  };

  const recordVideo = async (): Promise<Blob> => {
    return new Promise<Blob>((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true }) // ✅ Includes microphone
        .then((stream) => {
          setShowCamera(true);

          // ✅ Attach stream to video element
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          }, 500);

          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          recordedChunksRef.current = [];

          // ✅ Save recorded data
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              recordedChunksRef.current.push(event.data);
            }
          };

          // ✅ Convert recording to Blob
          mediaRecorder.onstop = () => {
            const videoBlob = new Blob(recordedChunksRef.current, { type: "video/webm" });
            resolve(videoBlob);
            closeCamera();
          };

          // ✅ Start recording for 10 seconds
          mediaRecorder.start();
          setTimeout(() => {
            mediaRecorder.stop();
          }, 10000);
        })
        .catch((error) => reject(error));
    });
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop()); // ✅ Stop camera & mic
    }
    setShowCamera(false);
  };

  return (
    <section className="home">
      <motion.div className="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h2>Welcome to Women's Safety and Alerts</h2>
        <p>This website is dedicated to providing resources and support for women's safety.</p>
        <motion.button className="emergency-button" onClick={handleEmergency} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          EMERGENCY
        </motion.button>
      </motion.div>

      {showCard && location && (
        <div className="card-overlay">
          <div className="card">
            <h3>Current Location</h3>
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
            <button onClick={() => setShowCard(false)}>Close</button>
          </div>
        </div>
      )}

      {showCamera && <video ref={videoRef} autoPlay playsInline className="camera-feed"></video>}
    </section>
  );
};

export default Home;








// import React, { useState, useRef } from "react";
// import { motion } from "framer-motion";
// import "./Home.css";

// // Define the props interface
// interface HomeProps {
//   onEmergency: (latitude: number, longitude: number) => void;
// }

// const Home: React.FC<HomeProps> = ({ onEmergency = () => {} }) => {
//   const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
//   const [showCard, setShowCard] = useState(false);
//   const [showCamera, setShowCamera] = useState(false);
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const handleEmergency = async () => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const { latitude, longitude } = position.coords;
//           setLocation({ latitude, longitude });
//           setShowCard(true);
  
//           try {
//             // Capture image from camera
//             const imageFile = await captureImage();
  
//             // Send data to backend
//             const formData = new FormData();
//             formData.append("latitude", latitude.toString());
//             formData.append("longitude", longitude.toString());
//             formData.append("image", imageFile);
  
//             const response = await fetch("http://localhost:5000/api/emergency", {
//               method: "POST",
//               body: formData,
//             });
  
//             if (response.ok) {
//               console.log("✅ Emergency alert sent successfully!");
//             } else {
//               console.error("❌ Failed to send emergency alert.");
//             }
//           } catch (error) {
//             console.error("❌ Error:", error);
//           }
//         },
//         (error) => {
//           alert("Error getting location: " + error.message);
//         }
//       );
//     } else {
//       alert("Geolocation is not supported by this browser.");
//     }
//   };
  
//   // Capture image from the camera as a Blob
//   const captureImage = async () => {
//     return new Promise<Blob>((resolve, reject) => {
//       const videoElement = document.createElement("video");
//       const canvas = document.createElement("canvas");
//       const context = canvas.getContext("2d");
  
//       navigator.mediaDevices
//         .getUserMedia({ video: true })
//         .then((stream) => {
//           videoElement.srcObject = stream;
//           videoElement.play();
  
//           setTimeout(() => {
//             canvas.width = 200; // Resize to reduce the image size
//             canvas.height = 150;
//             context?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  
//             canvas.toBlob(
//               (blob) => {
//                 stream.getTracks().forEach((track) => track.stop()); // Stop the camera
//                 if (blob) {
//                   resolve(blob); // Send the Blob image
//                 } else {
//                   reject("Error capturing image");
//                 }
//               },
//               "image/jpeg",
//               0.5 // Reduce quality to 50%
//             );
//           }, 2000); // Wait 2 seconds before capturing the image
//         })
//         .catch((error) => reject(error)); // Reject on error
//     });
//   };

//   const closeCamera = () => {
//     if (videoRef.current && videoRef.current.srcObject) {
//       const stream = videoRef.current.srcObject as MediaStream;
//       stream.getTracks().forEach((track) => track.stop()); // Stop camera stream
//     }
//     setShowCamera(false);
//   };

//   return (
//     <section className="home">
//       <motion.div
//         className="content"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         <h2>Welcome to Women's Safety and Alerts</h2>
//         <p>This website is dedicated to providing resources and support for women's safety.</p>
//         <motion.button
//           className="emergency-button"
//           onClick={handleEmergency}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           EMERGENCY
//         </motion.button>
//       </motion.div>

//       {showCard && location && (
//         <div className="card-overlay">
//           <div className="card">
//             <h3>Current Location</h3>
//             <p>Latitude: {location.latitude}</p>
//             <p>Longitude: {location.longitude}</p>
//             <button onClick={() => setShowCard(false)}>Close</button>
//           </div>
//         </div>
//       )}

//       {showCamera && (
//         <div className="camera-overlay">
//           <video ref={videoRef} autoPlay playsInline className="camera-feed"></video>
//           <button onClick={closeCamera}>Close Camera</button>
//         </div>
//       )}
//     </section>
//   );
// };

// export default Home;
