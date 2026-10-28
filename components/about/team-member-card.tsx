import Image from 'next/image'
import { Avatar } from '@/components/ui/avatar'
import type { TeamMemberRef } from '@/lib/sanity/types'

export function TeamMemberCard({ member }: { member: TeamMemberRef }) {
  return (
    <div className="rounded-card border-default bg-canvas h-full border p-3">
      <div className="bg-muted rounded-input relative flex aspect-[4/5] items-center justify-center overflow-hidden">
        {member.photo ? (
          <Image
            src={member.photo.url}
            alt={member.photo.alt}
            fill
            sizes="(min-width: 640px) 320px, 82vw"
            className="object-cover"
          />
        ) : (
          <Avatar name={member.name} className="h-20 w-20 text-2xl" />
        )}
      </div>
      <div className="px-2 pt-5 pb-2">
        <h3 className="font-display text-fg-heading text-xl font-semibold">{member.name}</h3>
        <p className="text-fg-muted mt-1 text-sm">{member.role}</p>
        {member.bio && <p className="text-fg-muted mt-3 text-sm leading-relaxed">{member.bio}</p>}
        {member.quote && <p className="text-fg-subtle mt-3 text-sm italic">“{member.quote}”</p>}
      </div>
    </div>
  )
}
