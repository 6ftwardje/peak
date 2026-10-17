"use client";

import { MoveUpRight } from 'lucide-react';
import { MotionConfig, motion } from 'motion/react';
import { cn } from '@/lib/utils';
import '@/styles/conditiongrid.css';

export interface ConditionProject {
  id: string;
  img: string;
  imgSmall?: string;
  imageAlt: string;
  imagePlaceholder: boolean;
  title: string;
  des: string;
  sector: string;
  developing: boolean;
  client: { name: string; logo: string; placeholder: boolean };
}

interface ConditionGridProps {
  projects: ConditionProject[];
  className?: string;
}

/** Astro renders every card to HTML; hydration only adds the hover lift. */
export default function ConditionGrid({ projects, className }: ConditionGridProps) {
  return (
    <MotionConfig reducedMotion="user">
      <div className={cn('condition-grid grid grid-cols-1 gap-4 lg:grid-cols-12', className)}>
        {projects.map((project, index) => (
          <motion.article
            key={project.id}
            initial={false}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={cn('bento-card relative min-w-0', projects.length === 3
              ? index === 0 ? 'lg:col-span-7 lg:row-span-2' : 'lg:col-span-5'
              : index % 4 === 0 || index % 4 === 3 ? 'lg:col-span-5' : 'lg:col-span-7')}
          >
            <a className="bento-link" href={`/cases/${project.id}`} aria-labelledby={`bento-title-${project.id}`} aria-describedby={`bento-summary-${project.id}`}>
              <div className="bento-media">
                <img
                  src={project.img}
                  srcSet={project.imgSmall ? `${project.imgSmall} 640w, ${project.img} 1280w` : undefined}
                  sizes={index === 0 ? '(min-width: 1024px) 58vw, 100vw' : '(min-width: 1024px) 42vw, 100vw'}
                  alt={project.imageAlt}
                  width={1280}
                  height={854}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="bento-shade" aria-hidden="true" />
              <div className="bento-flags">
                {project.imagePlaceholder && <span className="bento-placeholder">Sfeerbeeld · placeholder</span>}
              </div>
              <div className="bento-content">
                <div className="bento-client">
                  <span className="bento-logo"><img src={project.client.logo} width={210} height={40} loading="lazy" decoding="async" alt={project.client.placeholder ? 'Plaats voor het goedgekeurde klantlogo' : project.client.name} /></span>
                  {project.client.placeholder && <span className="bento-logo-note">Logo volgt</span>}
                </div>
                <div className="bento-sector"><span>{project.sector}</span>{project.developing && <span className="bento-status">In ontwikkeling</span>}</div>
                <div className="bento-title-row">
                  <h3 id={`bento-title-${project.id}`}>{project.title}</h3>
                  <span className="bento-arrow" aria-hidden="true"><MoveUpRight size={22} strokeWidth={1.5} /></span>
                </div>
                <div className="bento-details"><div className="bento-details-inner">
                  <p id={`bento-summary-${project.id}`} className="bento-summary">{project.des}</p>
                  <span className="bento-read">Bekijk het project</span>
                </div></div>
              </div>
            </a>
          </motion.article>
        ))}
      </div>
    </MotionConfig>
  );
}
