'use client'

import { api } from '@/app/lib/api'
import { ArrowLeft } from 'lucide-react'
import Cookies from 'js-cookie'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import { MediaPicker } from '@/components/MediaPicker'
import { FormEvent } from 'react'
import { Form } from '@/components/Form'
dayjs.locale(ptBr)

interface MemoryProps {
  params: {
    id: string
  }
}

export default async function Memory({ params }: MemoryProps) {
  const router = useRouter()
  const idMemory = params.id
  const token = Cookies.get('token')
  const response = await api.get(`/memories/${idMemory}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const { id, content, isPublic, createdAt } = response.data
  let { coverUrl } = response.data

  async function handleDelete() {
    await api.delete(`memories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    await api.delete(
      `upload/${coverUrl.split('http://localhost:3333/uploads/').join('')}`,
    )

    router.push('/')
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const fileToUpload = formData.get('coverUrl')

    if (fileToUpload.name !== '') {
      const uploadFormData = new FormData()
      uploadFormData.set('file', fileToUpload)

      const uploadResponse = await api.post('/upload', uploadFormData)
      await api.delete(
        `upload/${coverUrl.split('http://localhost:3333/uploads/').join('')}`,
      )

      coverUrl = uploadResponse.data.fileUrl
    }

    await api.put(
      `/memories/${id}`,
      {
        coverUrl,
        content,
        isPublic: formData.get('isPublic'),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    router.push('/')
  }

  return (
    <form onSubmit={handleUpdate} className="mx-8 flex flex-col gap-4">
      <div className="mt-4 flex items-center justify-end text-sm text-gray-200">
        <ArrowLeft className="h-4 w-4" />
        <Link className="text-lg" href="/">
          Voltar à timeline
        </Link>
      </div>
      <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
        {dayjs(createdAt).format('D[ de ]MMMM[, ]YYYY')}
      </time>
      <Form public={isPublic} />
      <MediaPicker />
      <div className="flex flex-col gap-4">
        <Image
          className="aspect-video w-full rounded-lg object-cover"
          src={coverUrl}
          width={592}
          height={420}
          alt=""
        />
        <p className="text-lg leading-relaxed text-gray-100">{content}</p>
      </div>
      <div className="mb-4 flex justify-between font-alt text-sm uppercase text-black">
        <button
          type="button"
          className="rounded-full bg-red-500 px-5 py-3 leading-none hover:bg-red-600"
          onClick={handleDelete}
        >
          Delete
        </button>
        <button
          type="submit"
          className="rounded-full bg-green-500 px-5 py-3 leading-none hover:bg-green-600"
        >
          Update
        </button>
      </div>
    </form>
  )
}
