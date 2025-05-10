import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Rnd } from 'react-rnd';
import axios from 'axios';

const Upload = () => {
  const [category, setCategory] = useState('');
  const [posterFile, setPosterFile] = useState(null);
  const [posterSrc, setPosterSrc] = useState('');
  const [logoSrc, setLogoSrc] = useState(null); // Optional logo if you still want it.

  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);

  const [elements, setElements] = useState({
    text1: { x: 50, y: 50, width: 200, height: 50 },
    text2: { x: 50, y: 150, width: 200, height: 50 },
  });

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (!category) {
      toast.error('Please select a category first!');
      return;
    }
    if (file) {
      setPosterFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setPosterSrc(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const combineImageWithPlaceholders = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const posterImg = new Image();
    posterImg.src = posterSrc;

    return new Promise((resolve) => {
      posterImg.onload = async () => {
        canvas.width = 400;
        canvas.height = 560;

        // Draw poster
        ctx.drawImage(posterImg, 0, 0, canvas.width, canvas.height);

        // Draw placeholders (just empty rectangles)
        Object.entries(elements).forEach(([key, value]) => {
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.lineWidth = 2;
          ctx.strokeRect(value.x, value.y, value.width, value.height);
        });

        const combinedImage = canvas.toDataURL('image/png');
        resolve(combinedImage);
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!posterSrc) {
      toast.error('Please upload a poster image!');
      return;
    }
    if (!category) {
      toast.error('Please select a category!');
      return;
    }

    try {
      const combinedImageBase64 = await combineImageWithPlaceholders();
      const response = await fetch(combinedImageBase64);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('category', category);
      formData.append('image', blob, 'poster.png');

      // Save placeholder positions
      formData.append(
        'placeholders',
        JSON.stringify(
          Object.entries(elements).map(([key, value]) => ({
            key,
            x: value.x,
            y: value.y,
            width: value.width,
            height: value.height,
          }))
        )
      );

      const res = await axios.post('/api/posters/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Poster uploaded successfully!');
      console.log('Server response:', res.data);
    } catch (error) {
      toast.error('Failed to upload poster.');
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Upload Your Poster</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium text-gray-700">Select Category</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={category}
                onChange={handleCategoryChange}
              >
                <option value="">-- Choose Category --</option>
                <option value="offers">Offers</option>
                <option value="events">Events</option>
                <option value="festivals">Festivals</option>
              </select>

              <label className="block mt-4 mb-2 font-medium text-gray-700">Upload Poster Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePosterChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />

              {/* Optional: upload logo (if you still want this feature) */}
              {/* <label className="block mt-4 mb-2 font-medium text-gray-700">Upload Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              /> */}

              <button
                type="submit"
                className="mt-6 w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Submit Poster
              </button>
            </div>

            {/* Poster Preview */}
            <div className="relative w-full border border-gray-300 rounded-lg overflow-hidden">
              {posterSrc && (
                <div
                  ref={wrapperRef}
                  className="relative"
                  style={{
                    backgroundImage: `url(${posterSrc})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    width: '400px',
                    height: '560px',
                  }}
                >
                  {Object.entries(elements).map(([key, value]) => (
                    <Rnd
                      key={key}
                      bounds="parent"
                      size={{ width: value.width, height: value.height }}
                      position={{ x: value.x, y: value.y }}
                      onDragStop={(e, d) =>
                        setElements((prev) => ({
                          ...prev,
                          [key]: { ...prev[key], x: d.x, y: d.y },
                        }))
                      }
                      onResizeStop={(e, direction, ref, delta, position) =>
                        setElements((prev) => ({
                          ...prev,
                          [key]: {
                            ...prev[key],
                            width: parseInt(ref.style.width),
                            height: parseInt(ref.style.height),
                            ...position,
                          },
                        }))
                      }
                    >
                      <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-indigo-500 bg-white bg-opacity-40 rounded">
                        {/* Empty placeholder */}
                      </div>
                    </Rnd>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default Upload;
