import React, { useEffect, useState } from 'react';
import { getAllStudents } from '../services/studentService';
import { 
    Network, User, Shield, Volume2, Award, 
    ArrowRight, ChevronDown, ChevronRight, Search, 
    Users, RefreshCw, Star, GraduationCap, UserCheck
} from 'lucide-react';

export default function Reference() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedNodes, setExpandedNodes] = useState({});

    const fetchStudents = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllStudents();
            setStudents(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch relation data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const toggleExpand = (id) => {
        setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Tree Pruning Logic
    const buildRelationTrees = () => {
        if (!students || students.length === 0) return [];

        // 1. Map to nodes with children lists
        const nodes = students.map(s => ({
            id: s.id,
            studentId: s.studentId,
            name: s.name,
            role: s.role || 'STUDENT',
            referredBy: s.referredBy,
            email: s.email,
            status: s.status,
            children: []
        }));

        const nodeMap = new Map(nodes.map(n => [n.studentId, n]));

        // 2. Build links
        const allRoots = new Set();
        nodes.forEach(n => {
            if (n.referredBy) {
                const parent = nodeMap.get(n.referredBy);
                if (parent) {
                    parent.children.push(n);
                } else {
                    allRoots.add(n);
                }
            } else {
                allRoots.add(n);
            }
        });

        // 3. Prune tree recursively
        const finalRoots = new Set(allRoots);

        const prune = (parent) => {
            if (!parent || !parent.children) return;
            const childrenCopy = [...parent.children];
            
            childrenCopy.forEach(child => {
                const grandchildren = [...child.children];
                let shouldPruneChild = false;
                
                for (const grandchild of grandchildren) {
                    if (grandchild.role === 'AMBASSADOR') {
                        shouldPruneChild = true;
                        break;
                    }
                }
                
                if (shouldPruneChild) {
                    parent.children = parent.children.filter(c => c.studentId !== child.studentId);
                    finalRoots.add(child);
                    prune(child);
                } else {
                    prune(child);
                }
            });
        };

        allRoots.forEach(root => prune(root));

        // 4. Filter and return display roots (only roots with children, and exclude ADMINs)
        return Array.from(finalRoots).filter(root => {
            if (root.role === 'ADMIN') return false;
            return root.children.length > 0;
        });
    };

    const trees = buildRelationTrees();

    // Helper to get role details
    const getRoleBadge = (role) => {
        switch (role) {
            case 'ADMIN':
                return { label: 'Admin', color: 'bg-red-50 text-red-700 border-red-200', icon: Shield };
            case 'MARKETER':
                return { label: 'Marketer', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Volume2 };
            case 'AMBASSADOR':
                return { label: 'Ambassador', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Award };
            default:
                return { label: 'Student', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: GraduationCap };
        }
    };

    // Recursive component to render node and children
    const TreeNode = ({ node, depth = 0 }) => {
        const { label, color, icon: Icon } = getRoleBadge(node.role);
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedNodes[node.studentId] !== false; // default to expanded

        // Count students and ambassadors in children
        const studentCount = node.children.filter(c => c.role === 'STUDENT').length;
        const ambassadorCount = node.children.filter(c => c.role === 'AMBASSADOR').length;

        return (
            <div className="ml-0 sm:ml-6 my-2 animate-in fade-in duration-300">
                <div className="flex items-start gap-3 group">
                    {/* Visual Connection line */}
                    {depth > 0 && (
                        <div className="w-4 h-8 border-l-2 border-b-2 border-orange-100 rounded-bl-xl -mt-4 shrink-0" />
                    )}
                    
                    <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-orange-100 transition-all duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                    node.role === 'MARKETER' ? 'bg-purple-100 text-purple-600' :
                                    node.role === 'AMBASSADOR' ? 'bg-amber-100 text-amber-600' :
                                    'bg-blue-100 text-blue-600'
                                }`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{node.name}</h4>
                                    <p className="text-[10px] font-mono text-slate-400">{node.studentId}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${color}`}>
                                    {label}
                                </span>
                                {hasChildren && (
                                    <button 
                                        onClick={() => toggleExpand(node.studentId)}
                                        className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Node details / metrics */}
                        {hasChildren && (
                            <div className="mt-3 pt-3 border-t border-slate-50 flex gap-4 text-[11px] text-slate-500 font-medium">
                                {ambassadorCount > 0 && (
                                    <span className="flex items-center gap-1">
                                        <Award className="w-3.5 h-3.5 text-amber-500" />
                                        {ambassadorCount} Referred Ambassador{ambassadorCount > 1 ? 's' : ''}
                                    </span>
                                )}
                                {studentCount > 0 && (
                                    <span className="flex items-center gap-1">
                                        <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                                        {studentCount} Referred Student{studentCount > 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Render children recursively */}
                {hasChildren && isExpanded && (
                    <div className="pl-4 sm:pl-6 border-l-2 border-orange-50/70 ml-5 sm:ml-8 mt-1 space-y-1">
                        {node.children.map(child => (
                            <TreeNode key={child.studentId} node={child} depth={depth + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Loading Relationships...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 max-w-md mx-auto text-center bg-red-50 border border-red-100 rounded-3xl mt-12 animate-in zoom-in-95">
                <p className="text-red-600 font-bold mb-4">{error}</p>
                <button onClick={fetchStudents} className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-all">
                    Retry
                </button>
            </div>
        );
    }

    // Filter trees by search query if any
    const filteredTrees = trees.filter(root => {
        if (!searchTerm) return true;
        const matchesNode = (node) => {
            if (node.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                node.studentId.toLowerCase().includes(searchTerm.toLowerCase())) {
                return true;
            }
            return node.children.some(child => matchesNode(child));
        };
        return matchesNode(root);
    });

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-orange-50 pb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Network className="w-7 h-7 text-orange-500" />
                        Referral Network
                    </h1>
                    <p className="text-xs font-semibold text-slate-400 mt-1">
                        Track and manage references across Marketers, Ambassadors, and Students
                    </p>
                </div>
                
                <div className="w-full md:w-80 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by name or Student ID..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-sm transition-all"
                    />
                </div>
            </div>

            {/* Tree Forest */}
            <div className="space-y-6">
                {filteredTrees.length > 0 ? (
                    filteredTrees.map(treeRoot => (
                        <div key={treeRoot.studentId} className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-6 shadow-sm">
                            <TreeNode node={treeRoot} depth={0} />
                        </div>
                    ))
                ) : (
                    <div className="bg-white p-12 text-center rounded-[2rem] border border-dashed border-slate-200 max-w-md mx-auto">
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="font-bold text-slate-700">No Referral Networks Found</h3>
                        <p className="text-slate-400 text-xs mt-1">
                            {searchTerm ? 'Try adjusting your search filters' : 'Setup student referrers from the student list edit options'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}