import React from 'react';

// import './table.css';

import empty from './empty.svg';

function mergeTableData(columns = [], data = []) {
    console.log('data', data);
    return data.map((item, index) => {
        return (
            <tr key={String(index)}>
                {columns.map((item2) => {
                    const itemKey = item2.field || '';
                    const itemValue = item[itemKey];
                    const itemComponentFn = item2.component;
                    const itemRenderFn = item2.render;
                    const tdstyle = item2.tdStyle;
                    const tdcss = item2.tdClassName;
                    return (
                        <td key={itemKey} style={{...tdstyle,fontSize:'1rem', 
                        paddingTop: '1rem',
                        paddingBottom: '1rem',
                        whiteSpace: 'nowrap'}} className={tdcss} data-th={itemKey}>
                            <div className='td-wrap'>
                                {itemRenderFn ? itemRenderFn(item) : false ||
                                    itemComponentFn ? itemComponentFn(item) : false ||
                                itemValue}
                            </div>
                        </td>
                    )
                })}
            </tr>
        );
    });
}

export default function Table(props) {
    let { columns, data, emptyRender } = props;
    let { emptyText} = props;
    columns = columns || [];
    data = data || [];
    const plview = ({ emptyRender }) => {
        const defaultView = () => {
            return (
                <td style={{
                    textAlign: 'center'
                }} colSpan={columns.length}>
                    <div style={{
                        padding: '4rem 0'
                    }}>
                        <div style={{
                            height: '2rem',
                            color: 'rgba(0, 0, 0, .7)',
                            marginBottom: '1rem'
                        }}>
                            <img src={empty} style={{ height: '100%' }} alt='nodata' />
                        </div>
                        <h5>
                            {emptyText||'No data available'}
                        </h5>
                    </div>
                </td>
            );
        }
        return (
            <tr>
                {emptyRender?emptyRender():defaultView()}
            </tr>
        );
    }
    return (
        <table className="table table-vcenter" >
                <thead>
                    <tr>
                        {columns.map((item) => {
                            let { field, name,thClassName, thStyle } = item;
                            field = field || '';
                            name = name || '';
                            return (
                                <th className={thClassName}
                                    style={{...thStyle,whiteSpace: 'nowrap',}}
                                    key={field}>
                                    {name}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {!data || data.length === 0 ? plview({ emptyRender }) : mergeTableData(columns, data)}
                </tbody>
            </table>
    );
}
