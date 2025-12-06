
import { useState } from "react";
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

export default function CommentForm({ onSubmit, initialText = "", isEdit = false, onCancel, setText: setParentText }) {
  const [text, setText] = useState(initialText);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText("");
    }
  };

  const handleChange = (e) => {
    if (setParentText) {
      setParentText(e.target.value);
    }
    setText(e.target.value);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Textarea
        placeholder="Add a comment..."
        value={setParentText ? initialText : text}
        onChange={handleChange}
        className="w-full"
      />
      <div className="flex justify-end gap-2 mt-2">
        <Button type="submit">
          {isEdit ? "Save" : "Comment"}
        </Button>
        {isEdit && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
