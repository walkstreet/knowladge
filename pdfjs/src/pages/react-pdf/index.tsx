import { Button } from 'antd';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './react-pdf.module.scss';
export type PrudentialEposPdfPreviewProps = {
  pdfFile: string;
  [key: string]: unknown;
};
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PrudentialEposPdfPreview = memo(
  (props: PrudentialEposPdfPreviewProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const {
      pdfFile = require('../../component/pdfPreview/fundamentalRight.pdf'),
    } = props;
    const [numPages, setNumPages] = useState(0);
    const [width, setWidth] = useState(window.innerWidth);
    const [scale, setScale] = useState(1);
    const [containerHeight, setContainerHeight] = useState(0);
    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
    };
    const loadingRender = () => {
      return (
        <div
          className={styles.loading}
          style={{ height: containerHeight }}
        >
          <div className={styles.loadingWrapper}></div>
        </div>
      );
    };
    const resizeHandler = () => {
      setWidth(window.innerWidth);
    };
    const zoomIn = () => {
      let zoom = scale + 1;
      setScale(zoom);
    };
    const zoomOut = () => {
      let zoom = scale;
      if (zoom > 1) {
        zoom = scale - 1;
        setScale(zoom);
      }
    };
    useEffect(() => {
      window.addEventListener('resize', resizeHandler);
      const elem = containerRef.current;
      if (elem && elem.parentNode) {
        const parentHeight = (elem.parentNode as HTMLDivElement).clientHeight;
        setContainerHeight(parentHeight);
      }
    }, []);
    useEffect(() => {
      return () => {
        window.removeEventListener('resize', resizeHandler);
      };
    }, []);
    return (
      <div
        ref={containerRef}
        className={styles.eposPdfContainer}
      >
        <Document
          className={styles.view}
          loading={loadingRender}
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              width={width}
              scale={scale}
            />
          ))}
        </Document>
        <div className={styles.actionGroup}>
          <Button
            shape="circle"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => zoomIn()}
          />
          <Button
            shape="circle"
            size="large"
            icon={<MinusOutlined />}
            onClick={() => zoomOut()}
          />
        </div>
      </div>
    );
  }
);
export default PrudentialEposPdfPreview;
