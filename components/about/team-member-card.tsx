import Image from 'next/image'
import { Avatar } from '@/components/ui/avatar'
import type { TeamMemberRef } from '@/lib/sanity/types'

export function TeamMemberCard({ member }: { member: TeamMemberRef }) {
  return (
    <div className="rounded-card border-default bg-canvas border p-6 text-center">
      {member.photo ? (
        <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full">
          <Image
            src={member.photo.url}
            alt={member.photo.alt}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      ) : (
        <Avatar name={member.name} className="mx-auto h-20 w-20 text-2xl" />
      )}
      <h3 className="font-display text-fg-heading mt-4 font-semibold">{member.name}</h3>
      <p className="text-fg-muted text-sm">{member.role}</p>
      {member.bio && <p className="text-fg-muted mt-3 text-sm">{member.bio}</p>}
      {member.quote && <p className="text-fg-subtle mt-3 text-sm italic">“{member.quote}”</p>}
    </div>
  )
}
