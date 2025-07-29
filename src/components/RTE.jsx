import React, {useEffect}from 'react'
import {useEditor, EditorContent} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {Controller} from 'react-hook-form'

const MenuBar = ({ editor }) => {
  if (!editor) return null

  return (
    <div className="flex gap-2 mb-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'font-bold' : ''}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'italic' : ''}
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        P
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • List
      </button>
    </div>
  )
}

const RTE = ({name, control, label}) => {

  return (
    <div className='w-full'>
        {label && 
        <label className='inline-block mb-1 pl-1 '>
            {label}
        </label>}

        <Controller
        name={name}
        control={control}
        defaultValue="<p>Start writing...</p>"
        render={({ field: { onChange, value } }) => {
          const editor = useEditor({
            extensions: [StarterKit],
            content: value,
            onUpdate: ({ editor }) => {
              onChange(editor.getHTML())
            },
          })

          // Set content manually if it comes from server/post (to avoid stale state)
          useEffect(() => {
            if (editor && value !== editor.getHTML()) {
              editor.commands.setContent(value || '')
            }
          }, [value, editor])

          return (
            <>
              <MenuBar editor={editor} />
              <div className="border rounded-md p-2 bg-white min-h-[200px]">
                <EditorContent editor={editor} />
              </div>
            </>
          )
        }}
      />
    </div>
  )
}

export default RTE
