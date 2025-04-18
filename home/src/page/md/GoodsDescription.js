import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useRef } from "react";

export default function GoodsDescription({ value, onChange }) {

	const editorRef = useRef(null);
	const quillRef = useRef(null);
	useEffect(() => {
		if (editorRef.current && !quillRef.current) {
			quillRef.current = new Quill(editorRef.current, {
				theme: "snow",
				placeholder: "굿즈 설명을 입력하세요...",
				modules: {
					toolbar: [
						[{ header: [1, 2, false] }],
						["bold", "italic", "underline"],
						["link"],
						[{ list: "ordered" }, { list: "bullet" }],
					],
					clipboard: {
						// onPaste를 사용하여 붙여넣기에서 이미지를 막음
						onPaste: (e) => {
							const items = e.clipboardData.items;
							for (let i = 0; i < items.length; i++) {
								if (items[i].type.indexOf("image") !== -1) {
									e.preventDefault(); // 이미지 붙여넣기 방지
									return;
								}
							}
						},
						// onDrop을 사용하여 드래그 앤 드롭에서 이미지를 막음
						onDrop: (e) => {
							const items = e.dataTransfer.items;
							for (let i = 0; i < items.length; i++) {
								if (items[i].type.indexOf("image") !== -1) {
									e.preventDefault(); // 이미지 드래그 앤 드롭 방지
									return;
								}
							}
						},
						matchers: [
							// 이미지 드래그 앤 드롭을 막는 코드 (이미지 삽입 방지)
							["img", (node, delta) => {
								return delta; // 이미지 삽입을 막기 위해 delta를 그대로 반환
							}]
						]
					}
				}
			});

			quillRef.current.on("text-change", () => {
				const html = editorRef.current.querySelector(".ql-editor").innerHTML;
				onChange(html);
			});
		}

		// 초기값 설정
		if (quillRef.current && value && quillRef.current.root.innerHTML !== value) {
			quillRef.current.root.innerHTML = value;
		}
	}, [value, onChange]);


	return <div
		ref={editorRef}
		className="md_form-input"
		style={{
			height: "calc(100% - 30px)",
			minHeight: "calc(100% - 30px)",
			width: "100%",
			backgroundColor: "#fff",
			border: "1px solid #ddd",
			borderRadius: "4px",
			fontSize: "1rem",
			padding: "8px 12px",
		}}
	/>;
}