import { useState } from "react";
import { DeleteAttachment } from "./buttons";

export function AttachmentList({ attachments }: { attachments: string[] }) {
    const [attachmentList, setAttachmentList] = useState(attachments);

    function handleClick(attachment: string) {
        console.log(`Deleting attachment: ${attachment}`)
        setAttachmentList(attachmentList.filter(attachment => attachment !== attachment))
    }

    return (
        <ul>
            {attachmentList.map(attachment => (
                <li key={attachment} className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-start gap-3">
                        {/* <DeleteAttachment /> */}
                        <label>{attachment}</label>
                    </div>
                </li>
            ))}
        </ul>
    )
}