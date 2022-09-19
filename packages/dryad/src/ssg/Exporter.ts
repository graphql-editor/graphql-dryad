import FileSaver from 'file-saver';
import { DryadFunctionResult } from './DryadFunction';
import { HtmlSkeletonStatic } from './HtmlSkeleton';
export const ExportSSG = ({
  result,
  style,
}: {
  result: DryadFunctionResult;
  style?: string;
}) => {
  if (!result) {
    throw new Error('Cannot generate html');
  }
  const { body, script } = result;
  const compiled = HtmlSkeletonStatic({
    body,
    style,
    script,
  });
  FileSaver.saveAs(new Blob([compiled]), 'dryad.html');
};
