import React, { useState } from "react";
import axios from "axios";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

const SendPackage = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [weight, setWeight] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [filePaths, setFilePaths] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [message, setMessage] = useState("");

  const handlePickupLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const address = response.data.address;
          console.log("Location Address:", `${address.city} ${address.country} ${address.state}`);
          setPickupLocation(`${address.city} ${address.country} ${address.state}`);
        } catch (error) {
          console.log("Error getting Location Address:", error);
          setMessage(error.response.data.error);
        }
      });
    } else {
      setMessage("Geolocation is not supported by this browser.");
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const paths = [];
    const previews = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64Data = await convertFileToBase64(file);
      const fileName = `${Date.now()}-${file.name}`;

      try {
        const result = await Filesystem.writeFile({
          path: `packages/${fileName}`,
          data: base64Data,
          directory: Directory.Data,
          encoding: Encoding.UTF8,
        });
        paths.push(result.uri);
        previews.push(URL.createObjectURL(file)); // Create a URL for the preview
        console.log("file saved");
      } catch (error) {
        console.error("Error storing file:", error);
      }
    }

    setFilePaths(paths);
    setImagePreviews(previews);
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    const newPaths = [...filePaths];
    const newPreviews = [...imagePreviews];
    newPaths.splice(index, 1);
    newPreviews.splice(index, 1);
    setFilePaths(newPaths);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("pickupLocation", pickupLocation);
    formData.append("deliveryLocation", deliveryLocation);
    formData.append("weight", weight);
    formData.append("dimensions", dimensions);

    for (let i = 0; i < filePaths.length; i++) {
      const fileBlob = await fetch(filePaths[i]).then((r) => r.blob());
      formData.append("files", fileBlob, `file${i}.jpg`);
    }

    try {
      const response = await axios.post("/api/packages", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Package sent successfully!");
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Send a Package</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Pickup Location:</label>
          <input
            type="text"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            placeholder="Enter pickup location"
            required
          />
          <button type="button" onClick={handlePickupLocation}>
            Use Current Location
          </button>
        </div>
        <div>
          <label>Delivery Location:</label>
          <input
            type="text"
            value={deliveryLocation}
            onChange={(e) => setDeliveryLocation(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Weight:</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Dimensions:</label>
          <input
            type="text"
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Package Photos:</label>
          <div className="image-previews">
            {imagePreviews.map((preview, index) => (
              <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                <img src={preview} alt={`Preview ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  style={{ position: 'absolute', top: '0', right: '0', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '10%', cursor: 'pointer' }}
                >
                  X
                </button>
              </div>
            ))}
          </div>
          <input type="file" multiple onChange={handleFileChange} required />
        </div>
        <button type="submit">Send Package</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SendPackage;
