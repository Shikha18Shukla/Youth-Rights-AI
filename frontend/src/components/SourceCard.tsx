import type { Source } from '../types';

interface SourceCardProps {
  source: Source;
}

export function SourceCard({ source }: SourceCardProps) {
  return (
    <div className="bg-sage-light/30 border border-border rounded-lg p-3 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium text-charcoal truncate">
            {source.article && <span className="text-forest">{source.article} — </span>}
            {source.documentName}
          </p>
          {source.sourceUrl && (
            <a
              href={source.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gold-dark hover:underline break-all"
            >
              View official source →
            </a>
          )}
        </div>
        {source.score > 0 && (
          <span className="text-xs text-sage-dark whitespace-nowrap">
            {Math.round(source.score * 100)}% match
          </span>
        )}
      </div>
      {source.snippet && (
        <p className="text-xs text-charcoal-light mt-1 line-clamp-2">{source.snippet}</p>
      )}
    </div>
  );
}
