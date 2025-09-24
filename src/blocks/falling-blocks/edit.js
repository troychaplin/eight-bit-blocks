import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const { gameWidth, gameHeight, showControls } = attributes;
	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Game Settings', 'falling-blocks-block-wp')}>
					<RangeControl
						label={__('Game Width', 'falling-blocks-block-wp')}
						value={gameWidth}
						onChange={(value) => setAttributes({ gameWidth: value })}
						min={200}
						max={500}
					/>
					<RangeControl
						label={__('Game Height', 'falling-blocks-block-wp')}
						value={gameHeight}
						onChange={(value) => setAttributes({ gameHeight: value })}
						min={300}
						max={800}
					/>
					<ToggleControl
						label={__('Show Control Buttons', 'falling-blocks-block-wp')}
						checked={showControls}
						onChange={(value) => setAttributes({ showControls: value })}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<div className="falling-blocks-preview" style={{
					width: gameWidth + 'px',
					height: gameHeight + 'px',
					border: '2px solid #333',
					backgroundColor: '#000',
					position: 'relative',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					color: '#fff',
					fontFamily: 'monospace'
				}}>
					<div style={{ textAlign: 'center' }}>
						<div style={{ fontSize: '24px', marginBottom: '10px' }}>🎮</div>
						<div>{__('Falling Blocks Game', 'falling-blocks-block-wp')}</div>
						<div style={{ fontSize: '12px', opacity: 0.7, marginTop: '5px' }}>
							{gameWidth} × {gameHeight}px
						</div>
						<div style={{ fontSize: '10px', opacity: 0.5, marginTop: '10px' }}>
							{__('Game will be interactive on the front end', 'falling-blocks-block-wp')}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
	