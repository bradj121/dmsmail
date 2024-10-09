import { useState } from "react";
import { TrashIcon } from '@heroicons/react/24/outline';

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
                        <button className="rounded-md border p-2 hover:bg-gray-100" onClick={handleClick.bind(null, attachment)}>
                            <span className="sr-only">Delete Collateral</span>
                            <TrashIcon className="w-5" />
                        </button>
                        <label>{attachment}</label>
                    </div>
                </li>
            ))}
        </ul>
    )
}