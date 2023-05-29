import { Camera } from 'lucide-react'

interface props {
  public: boolean
}

export function Form(props: props) {
  return (
    <div className="flex items-center gap-4">
      <label
        htmlFor="media"
        className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
      >
        <Camera className="h-4 w-4" />
        Anexar mídia
      </label>
      <label
        htmlFor="isPublic"
        className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
      >
        <input
          type="checkbox"
          name="isPublic"
          id="isPublic"
          defaultChecked={props.public}
          className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500"
        />
        Tornar memória pública
      </label>
    </div>
  )
}
