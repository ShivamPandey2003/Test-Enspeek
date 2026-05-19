import React from "react"
import Checkbox from "../../ui/Checkbox";
interface EmailEntry {
    email: string
    share: boolean
    modifyInput: boolean
    output: boolean
    initiateSample: boolean
}

interface EmailPermissionsTableProps {
    addedEmails: EmailEntry[]
    toggleCheckbox: (index: number, field: keyof Omit<EmailEntry, "email">) => void
}

const EmailPermissionsTable: React.FC<EmailPermissionsTableProps> = ({ addedEmails, toggleCheckbox }) => {
    if (addedEmails.length === 0) {
        return <div className="py-8 text-center theme-text-muted">No user added</div>
    }

    return (
        <div className="theme-surface theme-border mb-4 overflow-hidden rounded-lg border">
            <table className="w-full">
                <thead>
                    <tr className="theme-surface-soft">
                        <th className="px-4 py-3 text-left text-sm font-medium theme-text-default">Email</th>
                        <th className="px-4 py-3 text-center text-sm font-medium theme-text-default">Share</th>
                        </tr>
                </thead>
                <tbody>
                    {addedEmails.map((entry, index) => (
                        <tr key={index} className="theme-border border-t">
                            <td className="px-4 py-3 text-sm theme-text-strong">{entry.email}</td>
                            {["share"].map((field) => (
                                <td key={field} className="px-4 py-3 text-center">
                                    <Checkbox
                                        checked={entry[field as keyof EmailEntry] as boolean || field === "share"}
                                        onChange={() => toggleCheckbox(index, field as keyof Omit<EmailEntry, "email">)}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default EmailPermissionsTable
