import React, { useRef, useState } from "react";
import Container from "../../../shared/components/container/Container";
import Button from "../../../shared/components/button/Button";
import Input from "../../../shared/components/input/Input";
import Icon from "../../../shared/components/icon/Icon"; 
import type { ProfileBannerModalContentProps } from "../modalTypes";
import TrianglifyBanner from "../../../shared/components/trianglifyBanner/TrianglifyBanner";

const ProfileBannerModalContent: React.FC<ProfileBannerModalContentProps> = ({
  yColors = ["#ffffff", "#cccccc"],
  xColors = ["#000000", "#333333"],
  auxImage = null,
  cellSize = 50,
  variance = 0.5,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    yColors,
    xColors,
    auxImage,
    cellSize,
    variance,
  });

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File) => {
    const url = URL.createObjectURL(file);
    handleChange("auxImage", url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <Container TwClassName="flex flex-col gap-4">
      <TrianglifyBanner width='w-full' height={175} yColors={formData.yColors} xColors={formData.xColors} variance={formData.variance} cellSize={formData.cellSize} auxImage=""/>
      <Container TwClassName="gap-2">
        <Input
          type="color"
          value={formData.yColors[0]}
          onChange={(e) =>
            handleChange("yColors", [e.target.value, formData.yColors[1]])
          }
        />
        <Input
          type="color"
          value={formData.yColors[1]}
          onChange={(e) =>
            handleChange("yColors", [formData.yColors[0], e.target.value])
          }
        />
      </Container>

      <Container TwClassName="gap-2">
        <Input
          type="color"
          value={formData.xColors[0]}
          onChange={(e) =>
            handleChange("xColors", [e.target.value, formData.xColors[1]])
          }
        />
        <Input
          type="color"
          value={formData.xColors[1]}
          onChange={(e) =>
            handleChange("xColors", [formData.xColors[0], e.target.value])
          }
        />
      </Container>

      <Input
        type="number"
        value={formData.cellSize}
        min={10}
        max={200}
        onChange={(e) => handleChange("cellSize", Number(e.target.value))}
      />

      <Input
        type="number"
        value={formData.variance}
        min={0}
        max={1}
        step={0.1}
        onChange={(e) => handleChange("variance", Number(e.target.value))}
      />

      <div
        className={`border-2 ${
          isDragging
            ? "border-primary bg-blue-50"
            : "border-dashed border-gray-400"
        } rounded-lg p-4 flex items-center justify-center cursor-pointer relative h-48 transition-colors`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
      >
        {!formData.auxImage ? (
          <div className="flex flex-col items-center text-gray-500">
            <Icon name="Camera" TwClassName="w-10 h-10 mb-2" />
            <span className="text-sm">Click or drag image to upload</span>
          </div>
        ) : (
          <img
            src={formData.auxImage}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
          }}
        />
      </div>

      <Button
        onClick={() => onSave?.(formData)}
        TwClassName="p-2 bg-primary rounded-xl text-white border-1 border-primary hover:bg-transparent hover:text-primary"
      >
        Save
      </Button>
    </Container>
  );
};

export default ProfileBannerModalContent;
