import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { calculateCurrentCaffeineLevel, getCaffeineAmount, timeSinceConsumption } from "../ultis";

export default function History() {
  const { globalData } = useAuth();
  const [selectedItem, setSelectedItem] = useState(null);
  const [boxPosition, setBoxPosition] = useState({ top: 0, left: 0 });

  const handleItemClick = (e, coffee, timeSinceConsume, remainingAmount, originalAmount) => {
    
    if (selectedItem && selectedItem.coffee === coffee) {
      setSelectedItem(null);
      return;
    }

    const iconRect = e.currentTarget.getBoundingClientRect();
    const offsetX = 10; 
    const offsetY = 10; 
    const boxWidth = 250; 
    const boxHeight = 150; 

    
    let x = iconRect.right + offsetX;
    let y = iconRect.bottom + offsetY;

    
    if (x + boxWidth > window.innerWidth) {
      x = window.innerWidth - boxWidth - offsetX;
    }
    
    if (y + boxHeight > window.innerHeight) {
      y = window.innerHeight - boxHeight - offsetY;
    }

    setBoxPosition({ top: y, left: x });
    setSelectedItem({ coffee, timeSinceConsume, remainingAmount, originalAmount });
  };

  // Ẩn click-box khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectedItem && !e.target.closest(".click-box") && !e.target.closest(".coffee-item")) {
        setSelectedItem(null);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [selectedItem]);

  // Ẩn click-box khi cuộn ra khỏi phần History
  useEffect(() => {
    const handleScroll = () => {
      const historySection = document.querySelector(".coffee-history");
      if (historySection) {
        const rect = historySection.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          setSelectedItem(null);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="section-header">
        <i className="fa-solid fa-clock"></i>
        <h2>History</h2>
      </div>
      <p><i>Click on an icon for more information</i></p>
      <div className="coffee-history">
        {Object.keys(globalData)
          .sort((a, b) => b - a)
          .map((utcTime, i) => {
            const coffee = globalData[utcTime];
            if (!coffee) return null;
            const timeSinceConsume = timeSinceConsumption(utcTime);
            const originalAmount = getCaffeineAmount(coffee.name);
            const remainingAmount = calculateCurrentCaffeineLevel({ [utcTime]: coffee });

            return (
              <div
                key={i}
                className="coffee-item"
                onClick={(e) =>
                  handleItemClick(e, coffee, timeSinceConsume, remainingAmount, originalAmount)
                }
                style={{ display: "inline-block", margin: "5px", cursor: "pointer" }}
              >
                <i className="fa-solid fa-mug-hot" style={{ fontSize: "24px" }}></i>
              </div>
            );
          })}
      </div>

      {selectedItem && (
        <div
          className="click-box"
          style={{
            position: "fixed",
            top: `${boxPosition.top}px`,
            left: `${boxPosition.left}px`,
            backgroundColor: "#fff",
            color: "#000",
            padding: "12px",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
            zIndex: 9999,
            minWidth: "220px",
            maxWidth: "300px",
            textAlign: "left",
            wordWrap: "break-word",
            transition: "opacity 0.2s ease-in-out",
          }}
        >
       
          <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>{selectedItem.coffee.name}</h3>
          <p style={{ margin: "4px 0", fontSize: "14px" }}>
            <strong>Time Consumption:</strong> {selectedItem.timeSinceConsume} ago
          </p>
          <p style={{ margin: "4px 0", fontSize: "14px" }}>
            <strong>Cost:</strong> ${selectedItem.coffee.cost || "0"}
          </p>
          <p style={{ margin: "4px 0", fontSize: "14px" }}>
            <strong>Caffeine Remaining:</strong> {selectedItem.remainingAmount}mg / {selectedItem.originalAmount}mg
          </p>
        </div>
      )}
    </>
  );
}





