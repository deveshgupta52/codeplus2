
import { useState } from "react";

export default function CommentForm({ onSubmit, initialText = "", isEdit = false, onCancel }) {
  const [text, setText] = useState(initialText);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        rows="3"
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <div className="flex gap-2 mt-2">
        <button type="submit" className="bg-purple-600 text-white p-2 rounded">
          {isEdit ? "Save" : "Comment"}
        </button>
        {isEdit && (
          <button type="button" onClick={onCancel} className="bg-gray-500 text-white p-2 rounded">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
