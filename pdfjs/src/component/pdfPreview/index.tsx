import { Button } from 'antd';
import * as pdfjs from 'pdfjs-generic-legacy';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { memo, useEffect, useRef, useState } from 'react';

import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

import styles from './pdfPreview.module.scss';

export type PrudentialEposPdfPreviewProps = {
  pdfFile?: string;
  [key: string]: unknown;
};

// 如要引入本地worker，需要webpack支持worker-loading
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const PrudentialEposPdfPreview = memo(
  (props: PrudentialEposPdfPreviewProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const pdfContentRef = useRef<HTMLDivElement | null>(null);

    const { pdfFile = require('./fundamentalRight.pdf') } = props;
    const [containerHeight, setContainerHeight] = useState(0);
    const [isDisplay, setIsDisplay] = useState(true);
    const [scale, setScale] = useState(1);
    const [originScale, setOriginScale] = useState(1);

    const clearDraw = () => {
      if (pdfContentRef && pdfContentRef.current) {
        pdfContentRef.current.innerHTML = '';
      }
    };

    const loadPdf = async (url: string) => {
      const loadingTask = pdfjs.getDocument(url);
      const pdf = await loadingTask.promise;
      setIsDisplay(false);
      clearDraw();
      return pdf;
    };

    const renderPage = async (
      pdf: { getPage: (arg0: number) => any },
      pageNumber = 1,
      scalePara?: number
    ) => {
      const page = await pdf.getPage(pageNumber);

      // 使用默认的缩放比例获取视口
      const unscaledViewport = page.getViewport({ scale: 1 });

      const originScale = window.innerWidth / unscaledViewport.width;

      setOriginScale(originScale);

      // 选择合适的缩放比例
      const scale = scalePara || originScale;
      setScale(scale);

      const viewport = page.getViewport({ scale });

      // 创建一个 canvas 元素来渲染页面
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      if (pdfContentRef && pdfContentRef.current) {
        pdfContentRef.current.appendChild(canvas);
      }

      // 渲染页面到 canvas 上
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;
    };

    const init = async () => {
      clearDraw();
      const pdf = await loadPdf(pdfFile);
      for (let curPage = 0; curPage < pdf.numPages; curPage++) {
        renderPage(pdf, curPage + 1);
      }
    };

    let resizeTimeout: string | number | NodeJS.Timeout | undefined;

    const initContainerHeight = () => {
      const elem = containerRef.current;
      if (elem && elem.parentNode) {
        const parentHeight = (elem.parentNode as HTMLDivElement).clientHeight;
        setContainerHeight(parentHeight);
      }
    };

    useEffect(() => {
      // loading 高度计算
      initContainerHeight();

      // pdf preview初始
      init();
      window.addEventListener('resize', () => {
        clearDraw();
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          init();
          initContainerHeight();
        }, 1000);
      });
    }, []);

    useEffect(() => {
      return () => {
        window.removeEventListener('resize', () => {
          clearDraw();
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => {
            init();
            initContainerHeight();
          }, 1000);
        });
      };
    }, []);

    const zoomIn = async () => {
      const curScale = scale + 1;
      setScale(curScale);
      const pdf = await loadPdf(pdfFile);
      for (let curPage = 0; curPage < pdf.numPages; curPage++) {
        renderPage(pdf, curPage + 1, curScale);
      }
    };

    const zoomOut = async () => {
      if (Math.floor(scale) > Math.floor(originScale)) {
        const curScale = scale - 1;
        setScale(curScale);
        const pdf = await loadPdf(pdfFile);
        for (let curPage = 0; curPage < pdf.numPages; curPage++) {
          renderPage(pdf, curPage + 1, curScale);
        }
      }
    };

    return (
      <div
        ref={containerRef}
        className={styles.pdfContainer}
        style={{ height: containerHeight }}
      >
        <div
          className={styles.pdfLoading}
          style={{ display: isDisplay ? 'flex' : 'none' }}
        >
          <div className={styles.pdfLoadingWrapper}></div>
        </div>
        <div
          ref={pdfContentRef}
          className={styles.pdfContent}
          style={{ display: !isDisplay ? 'block' : 'none' }}
        ></div>
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
