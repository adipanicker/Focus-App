import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
export default function ActivityDropdown({ value, onChange, }) {
    const [activities, setActivities] = useState([]);
    useEffect(() => {
        window.electronAPI.getActivities().then((list) => {
            setActivities(list);
        });
    }, []);
    return (_jsx("select", { value: value ?? "", onChange: (e) => onChange(Number(e.target.value)), className: "bg-neutral-800 text-white text-sm rounded-lg px-3 py-2 border border-neutral-700 focus:outline-none focus:border-neutral-500", children: activities.map((a) => (_jsx("option", { value: a.id, children: a.name }, a.id))) }));
}
