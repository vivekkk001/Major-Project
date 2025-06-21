import React from 'react';
import { Calendar, MapPin, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface ComplaintCardProps {
  complaint_id: number;
  description: string;
  department: string;
  status: 'pending' | 'in-progress' | 'resolved';
  created_at: string;
  address: string;
  image_url?: string;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint_id,
  description,
  department,
  status,
  created_at,
  address,
  image_url,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in-progress':
        return <AlertCircle className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'in-progress':
        return 'text-blue-400 bg-blue-400/10';
      case 'resolved':
        return 'text-green-400 bg-green-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="glass rounded-lg p-6 hover-lift border-l-4 border-l-teal-500 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors">
            Complaint #{complaint_id}
          </h3>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {description}
          </p>
        </div>
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="capitalize">{status.replace('-', ' ')}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>{address}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <span className="px-2 py-1 bg-teal-400/10 text-teal-400 rounded">
            {department}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <p className="text-xs text-gray-500">
          Complaint ID: <span className="text-teal-400 font-mono">{complaint_id}</span>
        </p>
        {image_url && (
          <img
            src={image_url}
            alt="Complaint"
            className="mt-4 rounded-md border border-gray-700 max-w-xs"
          />
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;
