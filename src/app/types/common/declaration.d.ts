// html2pdf.js는 TypeScript 타입 정의 파일을 기본적으로 제공하지 않기 때문에 declaration을 추가
declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[] // PDF의 여백 설정 (단위: mm)
    filename?: string // 생성될 PDF 파일의 이름
    image?: { type: string; quality: number } // 이미지 타입 및 품질 설정
    html2canvas?: unknown // html2canvas 옵션 설정
    jsPDF?: { unit: string; format: string } // jsPDF 옵션 설정
  }

  interface Html2Pdf {
    output(type: 'blob' | 'datauristring' | 'arraybuffer'): Promise<Blob | string | ArrayBuffer>
    from(element: HTMLElement): this
    set(options: Html2PdfOptions): this
    toPdf(): this
    get(type: 'blob' | 'datauristring' | 'arraybuffer'): Promise<Blob | string | ArrayBuffer>
    save(filename?: string): void
  }

  function html2pdf(): Html2Pdf

  export default html2pdf
}
