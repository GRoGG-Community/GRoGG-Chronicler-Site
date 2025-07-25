import React from 'react';

export default function cutOffDotter({ text, max = 18, children, ...props }) {
    const str = typeof text === 'string' ? text : (children || '');
    return (
        <span {...props} title={str}>
            {cutOffDotter.cut(str, max)}
        </span>
    );
}

cutOffDotter.cut = function(str, max = 18) {
    if (!str) return '';
    return str.length > max ? str.slice(0, max) + '…' : str;
};
