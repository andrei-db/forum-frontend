import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function ForumEditor() {
  const [value, setValue] = useState("");

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        modules={{
          toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block", "link"],
          ],
        }}
        formats={[
          "bold",
          "italic",
          "underline",
          "list",
          "bullet",
          "blockquote",
          "code-block",
          "link",
        ]}
      />

      <h3 className="mt-4">Preview</h3>
      <div dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  );
}
