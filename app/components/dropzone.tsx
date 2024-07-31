"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import { Upload } from "lucide-react";

function Dropzone({
  onFileSelect,
}: {
  onFileSelect: ({ dropFile }: { dropFile: FileWithPath }) => void;
}) {
  const onDrop = useCallback(
    (acceptedFiles: any) => {
      const file: FileWithPath = acceptedFiles[0];
      onFileSelect({ dropFile: file });
    },
    [onFileSelect]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [], "application/pdf": [".pdf"] },
  });

  return (
    <>
      <div
        {...getRootProps()}
        className="bg-blue-50 border-2 border-blue-700 border-dotted h-32 flex items-center justify-center"
      >
        <input {...getInputProps()} className="bg-red-500" />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <p>
              Drag &apos;n&apos; drop some file here or click to select file
            </p>
            <Upload className="text-blue-500 w-6 h-6" />
          </div>
        )}
      </div>
    </>
  );
}

export default Dropzone;
