import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";

const ChangePilotModal = ({ open, onClose, data, users, onSave, loading }) => {
    const [selectedUserId, setSelectedUserId] = useState("");
    
    useEffect(() => {
        if (open && data) {
            setSelectedUserId(data.currentUserId || "");
        }
    }, [open, data]);
    
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Thay đổi {data?.type === 'PILOT' ? 'Hoa tiêu' : 'Tập sự'}
                    </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                    <div>
                        <label>Người hiện tại: <strong>{data?.currentUserName || 'Chưa có'}</strong></label>
                    </div>
                    
                    <div>
                        <label>Chọn người mới:</label>
                        <select 
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="">-- Chọn --</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Hủy
                    </Button>
                    <Button onClick={() => onSave(selectedUserId)} disabled={loading || !selectedUserId}>
                        {loading ? "Đang lưu..." : "Xác nhận"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ChangePilotModal