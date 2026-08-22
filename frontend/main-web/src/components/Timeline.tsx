import type { HackathonConfig } from '../services/hackathonService';

interface TimelineProps {
  config: HackathonConfig | null;
}

export default function Timeline({ config }: TimelineProps) {
  const currentStage = config?.currentTimelineStage || 1;

  const stages = [
    {
      stage: 1,
      title: 'Registration',
      description: 'Initial signup and individual profile completion.',
      date: config?.registrationDeadline ? new Date(config.registrationDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'
    },
    {
      stage: 2,
      title: 'Team Formation Deadline',
      description: 'Connecting with peers and finalizing your squad.',
      date: config?.teamFormationDate ? new Date(config.teamFormationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'
    },
    {
      stage: 3,
      title: 'Hacking Begins',
      description: 'The 24-hour countdown starts now!',
      date: config?.hackingBeginsDate ? new Date(config.hackingBeginsDate).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'TBD'
    },
    {
      stage: 4,
      title: 'Submission',
      description: 'Window for all project deliverables.',
      date: config?.submissionOpensDate && config?.submissionDeadline 
        ? `${new Date(config.submissionOpensDate).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} to ${new Date(config.submissionDeadline).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })}`
        : config?.submissionDeadline 
          ? new Date(config.submissionDeadline).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
          : 'TBD'
    },
    {
      stage: 5,
      title: 'Ceremony',
      description: 'Announcement of winners and certificates.',
      date: config?.ceremonyDate ? new Date(config.ceremonyDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'
    }
  ];

  return (
    <div className="timeline-container pb-10 w-full">
      <div className="flex flex-col md:flex-row gap-8 md:gap-0 w-full">
        {stages.map((item, index) => {
          // A stage's line is blue if the current stage is strictly greater than this stage's index.
          const isLineBlue = currentStage > item.stage;
          const isCircleBlue = currentStage >= item.stage;

          return (
            <div key={item.stage} className={`flex-1 relative pl-8 pt-0 md:pl-0 md:pt-10 border-l-4 border-t-0 md:border-l-0 md:border-t-4 ${isLineBlue ? 'border-primary' : 'border-outline-variant'} ${index === 0 ? 'md:border-l-0' : ''}`}>
              <div className={`absolute -left-[14px] top-0 md:left-0 md:-top-[14px] size-6 rounded-full border-4 border-white shadow-sm transition-colors ${isCircleBlue ? 'bg-primary' : 'bg-surface-container-highest'}`}></div>
              <div className="pr-0 md:pr-8">
                <h5 className={`font-black mb-1 ${isCircleBlue ? 'text-primary' : 'text-on-surface-variant'}`}>{item.date}</h5>
                <h4 className="font-bold text-on-surface text-lg">{item.title}</h4>
                <p className="text-secondary text-sm mt-2">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
