import { LayoutTemplate, ArrowRight } from 'lucide-react';
import { TEMPLATES } from '../../data/mockData.js';
import Button from '../shared/Button.jsx';

const CATEGORY_COLORS = {
  Inpatient:  'bg-primary-100 text-primary-700',
  Outpatient: 'bg-success-100 text-success-700',
  Surgical:   'bg-warning-100 text-warning-700',
};

export default function TemplatesView() {
  return (
    <div className="flex-1 p-4 overflow-y-auto scrollbar-thin">
      <div className="max-w-4xl mx-auto space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Templates</h2>
          <p className="text-sm text-neutral-500 mt-0.5">Pre-configured document structures for faster generation</p>
        </div>

        <div
          role="list"
          aria-label="Document templates"
          className="grid grid-cols-2 gap-3"
        >
          {TEMPLATES.map(tpl => (
            <article
              key={tpl.id}
              role="listitem"
              className="card p-4 flex items-start gap-3 hover:shadow-md transition-shadow"
            >
              <div
                className="w-10 h-10 rounded-md bg-neutral-100 flex items-center justify-center flex-shrink-0"
                aria-hidden="true"
              >
                <LayoutTemplate size={18} className="text-neutral-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-sm text-neutral-900">{tpl.name}</h3>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-sm font-medium ${CATEGORY_COLORS[tpl.category] || 'bg-neutral-100 text-neutral-700'}`}
                    aria-label={`Category: ${tpl.category}`}
                  >
                    {tpl.category}
                  </span>
                </div>
                <p className="text-xs text-neutral-500">
                  {tpl.fields} fields · Used {tpl.usedCount.toLocaleString()} times
                </p>
              </div>
              <Button
                variant="ghost"
                size="xs"
                rightIcon={<ArrowRight size={12} />}
                aria-label={`Use ${tpl.name} template`}
              >
                Use
              </Button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
