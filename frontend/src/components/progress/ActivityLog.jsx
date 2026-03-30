import { Icon } from '../Common/Icon';
import { ICONS } from '../../utils/constants';

export const ActivityLog = ({ activities }) => {
    const iconMap = {
        tutorial: ICONS.book,
        test: ICONS.calendar
    };

    const colorMap = {
        tutorial: 'bg-blue-100 text-blue-600',
        test: 'bg-orange-100 text-orange-600'
    };

    return (
        <div className="bg-white p-6 rounded-xl ring-1 ring-orange-100">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex gap-4">
                        <div className="flex-shrink-0 flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full ${colorMap[activity.type]} flex items-center justify-center`}>
                                <Icon path={iconMap[activity.type]} className="w-4 h-4" />
                            </div>
                            <div className="w-px h-full bg-gray-200 my-1"></div>
                        </div>
                        <div className="pb-4">
                            <p className="text-gray-800 font-medium">{activity.action}</p>
                            <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};