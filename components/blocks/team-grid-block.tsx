import { TeamMemberCard } from '@/components/about/team-member-card'
import { Reveal, Stagger } from '@/components/motion/reveal'
import { getTeamMembers } from '@/lib/sanity/content'
import type { TeamMemberRef } from '@/lib/sanity/types'

export type TeamGridData = {
  heading?: string
  group?: 'foundingCircle' | 'advisor' | 'volunteer'
  members?: TeamMemberRef[]
}

export async function TeamGridBlock({ data }: { data: TeamGridData }) {
  const members = data.group ? await getTeamMembers(data.group) : (data.members ?? [])
  if (members.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
      {data.heading && (
        <Reveal>
          <h2 className="font-display text-fg-heading text-3xl font-semibold">{data.heading}</h2>
        </Reveal>
      )}
      <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {members.map((member) => (
          <Reveal key={member._id}>
            <TeamMemberCard member={member} />
          </Reveal>
        ))}
      </Stagger>
    </section>
  )
}
