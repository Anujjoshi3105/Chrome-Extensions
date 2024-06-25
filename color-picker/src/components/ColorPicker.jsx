import React, { useState, useEffect } from "react";
import { hexToRgb, rgbToHex, rgbToHsl, hslToHex } from "./helper";
  
const ColorPicker = () => {
  const [pickedColors, setPickedColors] = useState(() => {
    return JSON.parse(localStorage.getItem("color-list")) || [];
  });
  const [format, setFormat] = useState("all");
  const [paletteName, setPaletteName] = useState("Color Picker Palette");

  useEffect(() => {
    localStorage.setItem("color-list", JSON.stringify(pickedColors));
  }, [pickedColors]);

  const copyToClipboard = async (text, element) => {
    try {
      await navigator.clipboard.writeText(text);
      element.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-clipboard2-check-fill" viewBox="0 0 16 16">
          <path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5"/>
          <path d="M4.085 1H3.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1h-.585q.084.236.085.5V2a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 2v-.5q.001-.264.085-.5m6.769 6.854-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708.708"/>
        </svg>`;
      setTimeout(() => {
        element.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-clipboard2-fill" viewBox="0 0 16 16">
            <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"/>
            <path d="M3.5 1h.585A1.5 1.5 0 0 0 4 1.5V2a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 12 2v-.5q-.001-.264-.085-.5h.585A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1"/>
          </svg>`;
      }, 500);
    } catch (err) {
      alert("Failed to copy text!");
    }
  };

  const exportColor = () => {
    let colorText = "";
    pickedColors.forEach((colorObj) => {
      const hex = colorObj.color;
      const rgb = hexToRgb(hex);
      const hsl = rgbToHsl(rgb);
      let colorLine = "";

      switch (format) {
        case "hex":
          colorLine = hex;
          break;
        case "rgb":
          colorLine = rgb;
          break;
        case "hsl":
          colorLine = hsl;
          break;
        case "all":
          colorLine = `Hex: ${hex}, RGB: ${rgb}, HSL: ${hsl}`;
          break;
        default:
          colorLine = hex;
          break;
      }

      if (colorObj.name) {
        colorLine += `, name: ${colorObj.name}`;
      }

      colorText += colorLine + "\n";
    });

    const blob = new Blob([colorText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${paletteName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importColor = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt";

    input.addEventListener("change", () => {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const lines = reader.result.split("\n");
        lines.forEach((line) => {
          let colorObj = null;
          if (line.startsWith("Hex")) {
            const hexRegex = /Hex: #(.*?), RGB: rgb\((.*?), (.*?), (.*?)\), HSL: hsl\((.*?), (.*?), (.*?)%\)(?: \((.*?)\))?/;
            const match = line.match(hexRegex);
            if (match) {
              colorObj = {
                color: `#${match[1]}`,
                name: match[8] || "",
              };
            }
          } else if (line.startsWith("rgb")) {
            const rgbRegex = /rgb\((\d+), (\d+), (\d+)\)(?:, name:\s*(\w+))?/;
            const match = line.match(rgbRegex);
            if (match) {
              colorObj = {
                color: rgbToHex(match[1], match[2], match[3]),
                name: match[4] || "",
              };
            }
          } else if (line.startsWith("hsl")) {
            const hslRegex = /hsl\((\d+), (\d+)%, (\d+)%\)(?:, name:\s*(\w+))?/;
            const match = line.match(hslRegex);
            if (match) {
              colorObj = {
                color: hslToHex(match[1], match[2], match[3]),
                name: match[4] || "",
              };
            }
          } else if (line.startsWith("#")) {
            const match = line.match(/#([0-9a-fA-F]{3,6})(?:, name:\s*(\w+))?/);
            if (match) {
              colorObj = {
                color: `#${match[1]}`,
                name: match[2] || "",
              };
            }
          }

          if (colorObj && !pickedColors.some((c) => c.color === colorObj.color)) {
            setPickedColors((prevColors) => [...prevColors, colorObj]);
          }
        });
      };

      reader.readAsText(file);
    });

    input.click();
  };
  const addColor = async () => {
    if (!window.EyeDropper) {
        alert('Your browser does not support the EyeDropper API');
        return;
    }

    try {
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        const color = result.sRGBHex;
        if (pickedColors.some(c => c.color === color)) {
            alert('Color already added!');
            return;
        }
        setPickedColors([...pickedColors, { color, name: '', copied: false }]);
    } catch (e) {
        console.log(e);
    }
    
}
  const showColors = () => {
    return pickedColors.map((colorObj, index) => {
      const colorValue = colorObj.color;
      const rgb = hexToRgb(colorValue);
      const hsl = rgbToHsl(rgb);

      return (
        <li className="color" key={index}>
          <input
            type="color"
            className="rect"
            value={colorValue}
            onChange={(e) => {
              const newColor = e.target.value;
              setPickedColors((prevColors) =>
                prevColors.map((c, i) =>
                  i === index ? { ...c, color: newColor } : c
                )
              );
            }}
          />
          <input
            type="text"
            className="color-name"
            placeholder="Primary"
            value={colorObj.name}
            onChange={(e) => {
              const newName = e.target.value;
              setPickedColors((prevColors) =>
                prevColors.map((c, i) =>
                  i === index ? { ...c, name: newName } : c
                )
              );
            }}
          />
            
          <div className="codes">
            <div className="code">
              <span className="value">{colorValue}</span>
              <button onClick={(e) => copyToClipboard(colorValue, e.target)} className="copy-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-clipboard2-fill" viewBox="0 0 16 16">
            <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"/>
            <path d="M3.5 1h.585A1.5 1.5 0 0 0 4 1.5V2a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 12 2v-.5q-.001-.264-.085-.5h.585A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1"/>
          </svg>
              </button>
            </div>
            <div className="code">
              <span className="value">{rgb}</span>
              <button onClick={(e) => copyToClipboard(rgb, e.target)} className="copy-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-clipboard2-fill" viewBox="0 0 16 16">
                  <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"/>
                  <path d="M3.5 1h.585A1.5 1.5 0 0 0 4 1.5V2a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 12 2v-.5q-.001-.264-.085-.5h.585A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1"/>
                </svg>
              </button>
            </div>
            <div className="code">
              <span className="value">{hsl}</span>
              <button onClick={(e) => copyToClipboard(hsl, e.target)} className="copy-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-clipboard2-fill" viewBox="0 0 16 16">
            <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"/>
            <path d="M3.5 1h.585A1.5 1.5 0 0 0 4 1.5V2a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 12 2v-.5q-.001-.264-.085-.5h.585A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1"/>
          </svg>
              </button>
            </div>
          </div>
          <div className="delete-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16" onClick={() => {
              setPickedColors((prevColors) =>
                prevColors.filter((_, i) => i !== index)
              );
            }}>
              <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
            </svg>
          </div>
        </li>
      );
    });
  };
  const handlePaletteNameChange = (event) => {
    setPaletteName(event.target.value);
  };

  return (
    <>
      <input className="palette-name"   
        type="text"
        id="paletteName"
        value={paletteName}
        placeholder={paletteName}
        onChange={handlePaletteNameChange}
      ></input>
      <div className="btn">
      <button id="picker-btn" className="btn" onClick={addColor}>
        Pick Color
      </button>
      <select
        id="format-select"
        value={format}
        onChange={(e) => setFormat(e.target.value)}
      >
        <option value="all">All</option>
        <option value="hex">Hex</option>
        <option value="rgb">RGB</option>
        <option value="hsl">HSL</option>
      </select>
      </div>
      <div className="btn">
        <button onClick={exportColor}>Export</button>
        <button onClick={importColor}>Import</button>
      </div>
      <ul className="color-list">
        <div className="clear">
        <div 
          onClick={() => setPickedColors([])}
          className={`${pickedColors.length === 0 ? 'hide' : 'clear-btn'}`}
        >
          Clear All
      </div>
      </div>
      {showColors()}
        </ul>
    </>
  );
};


export default ColorPicker;
