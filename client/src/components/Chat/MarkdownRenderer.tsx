import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import { ChartBlock } from '../Charts/ChartBlock';

function stripIncompleteCodeBlocks(text: string): string {
  const fences = text.match(/```/g);
  if (fences && fences.length % 2 !== 0) {
    return text.substring(0, text.lastIndexOf('```'));
  }
  return text;
}

const components: Components = {
  code({ className, children }) {
    const match = className?.match(/^language-chart:(.+)$/);
    if (match) {
      const chartType = match[1];
      const dataJson = String(children).replace(/\n$/, '');
      return <ChartBlock chartType={chartType} dataJson={dataJson} />;
    }
    return <code className={className}>{children}</code>;
  },
  pre({ children }) {
    return <>{children}</>;
  },
};

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {stripIncompleteCodeBlocks(content)}
      </ReactMarkdown>
    </div>
  );
}
