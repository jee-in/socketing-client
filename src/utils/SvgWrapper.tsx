import { useState, useEffect, useContext, forwardRef } from "react";
import { AreaSocket, Seat } from "../types/api/socket";
import { ReservationContext } from "../store/ReservationContext";

interface SvgWrapperProps {
  svgString: string;
  seats: Seat[];
  areas: AreaSocket[];
  renderSeat: (seat: Seat) => React.ReactNode;
  onAreaClick?: (areaId: string) => void;
}

interface ParsedSvgData {
  svgString: string;
}

const SvgWrapper = forwardRef<SVGSVGElement, SvgWrapperProps>(
  ({ svgString, seats, areas, renderSeat, onAreaClick }, ref) => {
    const {
      joinArea,
      setSeatsMap,
      currentAreaId,
      setCurrentAreaId,
      exitArea,
      areaStats,
    } = useContext(ReservationContext);

    const [svgContent, setSvgContent] = useState<{
      viewBox: string;
      content: string;
    }>({
      viewBox: "",
      content: "",
    });

    const [hoveredAreaId, setHoveredAreaId] = useState<string | null>(null);

    useEffect(() => {
      if (!svgString) return;

      try {
        const parsedData = JSON.parse(svgString) as ParsedSvgData;
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = parsedData.svgString;
        const svgElement = tempDiv.querySelector("svg");

        if (svgElement) {
          setSvgContent({
            viewBox: svgElement.getAttribute("viewBox") || "",
            content: Array.from(svgElement.children)
              .filter((child) => {
                return (
                  !(child instanceof Element) ||
                  !child.classList.contains("seats")
                );
              })
              .map((child) => child.outerHTML)
              .join(""),
          });
        }
      } catch (error) {
        console.error("Error parsing SVG string:", error);
      }
    }, [svgString]);

    useEffect(() => {
      if (!areaStats) return;

      const interpolateColor = (ratio: number) => {
        if (ratio >= 0 && ratio < 0.25) {
          return "rgba(8, 79, 206, 0.983)";
        } else if (ratio >= 0.25 && ratio < 0.5) {
          return "rgba(66, 125, 224, 0.98)";
        } else if (ratio >= 0.5 && ratio < 0.75) {
          return "rgba(132, 162, 229, 0.991)";
        } else if (ratio >= 0.75 && ratio < 1) {
          return "rgba(157, 170, 206, 0.98)";
        } else {
          return "#808080";
        }
      };

      areaStats.forEach((stat) => {
        const areaElement = document.querySelector(
          `.areas [class='${stat.areaId}'] .area-data`
        );
        if (areaElement) {
          const ratio = stat.reservedSeatsNum / stat.totalSeatsNum;
          const color = interpolateColor(ratio);
          (areaElement as SVGPathElement).setAttribute("fill", color);
        }
      });
    }, [areaStats]);

    const handleAreaClick = (area: AreaSocket) => {
      if (currentAreaId === area.id) {
        return;
      }

      const areaElement = document.querySelector(
        `.areas [class='${area.id}'] .area-data`
      );
      if (areaElement instanceof SVGPathElement && onAreaClick) {
        onAreaClick(area.id);
      }

      setSeatsMap(new Map());
      if (currentAreaId !== null) {
        exitArea(currentAreaId);
      }
      joinArea(area.id);
      setCurrentAreaId(area.id);
    };

    const handleMouseEnter = (areaId: string) => {
      if (currentAreaId !== areaId) {
        setHoveredAreaId(areaId);
      }
    };

    // CSS styles for hover effects
    const getAreaStyles = (areaId: string) => {
      const isHovered = hoveredAreaId === areaId;
      const isSelected = currentAreaId === areaId;

      return {
        cursor: isSelected ? "default" : "pointer",
        transition: "all 0.3s ease",
        filter:
          !isSelected && isHovered
            ? "brightness(1.2) drop-shadow(0 0 3px rgba(0,0,0,0.3))"
            : "none",
        opacity: !isSelected && isHovered ? 0.9 : 1,
        stroke: isSelected ? "#2563eb" : "none",
        strokeWidth: isSelected ? "2" : "0",
      };
    };

    if (!svgContent.viewBox) return null;

    return (
      <svg
        ref={ref}
        width="100%"
        height="100%"
        viewBox={svgContent.viewBox}
        className="w-full h-full"
      >
        <g dangerouslySetInnerHTML={{ __html: svgContent.content }} />

        <g className="areas">
          {areas?.map((area) => (
            <g
              key={area.id}
              className={area.id}
              dangerouslySetInnerHTML={{ __html: area.svg }}
              onClick={() => handleAreaClick(area)}
              onMouseEnter={() => handleMouseEnter(area.id)}
              onMouseLeave={() => setHoveredAreaId(null)}
              style={getAreaStyles(area.id)}
            />
          ))}
        </g>

        <g className="seats">
          {seats?.map((seat) => (
            <g key={seat.id} transform={`translate(${seat.cx},${seat.cy})`}>
              {renderSeat(seat)}
            </g>
          ))}
        </g>
      </svg>
    );
  }
);

SvgWrapper.displayName = "SvgWrapper";

export default SvgWrapper;
