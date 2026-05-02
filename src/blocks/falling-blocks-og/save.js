import { useBlockProps } from '@wordpress/block-editor';
export default function save({ attributes }) {
	const { gameWidth, gameHeight, showControls } = attributes;
	const blockProps = useBlockProps.save();

	return (
		<div {...blockProps}>
			<div className="falling-blocks-og-container" data-width={gameWidth} data-height={gameHeight} data-show-controls={showControls}>
				<div className="falling-blocks-og-area">
					<canvas 
						className="falling-blocks-og-canvas" 
						width={gameWidth} 
						height={gameHeight}
					></canvas>
					<div className="falling-blocks-og-sidebar">
						<div className="falling-blocks-og-score-panel">
							<div className="score-item">
								<span className="label">Score:</span>
								<span className="value" id="falling-blocks-og-score">0</span>
							</div>
							<div className="score-item">
								<span className="label">Level:</span>
								<span className="value" id="falling-blocks-og-level">1</span>
							</div>
							<div className="score-item">
								<span className="label">Lines:</span>
								<span className="value" id="falling-blocks-og-lines">0</span>
							</div>
						</div>
						<div className="falling-blocks-og-next-piece">
							<div className="label">Next:</div>
							<canvas className="next-piece-canvas" width="80" height="80"></canvas>
						</div>
					</div>
				</div>
				{showControls && (
					<div className="falling-blocks-og-controls">
						<div className="control-row">
							<button className="falling-blocks-og-btn" data-action="rotate">↻</button>
						</div>
						<div className="control-row">
							<button className="falling-blocks-og-btn" data-action="left">←</button>
							<button className="falling-blocks-og-btn" data-action="down">↓</button>
							<button className="falling-blocks-og-btn" data-action="right">→</button>
						</div>
						<div className="control-row">
							<button className="falling-blocks-og-btn falling-blocks-og-btn-wide" data-action="drop">DROP</button>
						</div>
						<div className="control-row">
							<button className="falling-blocks-og-btn falling-blocks-og-btn-restart" data-action="restart">RESTART</button>
						</div>
					</div>
				)}
				<div className="falling-blocks-og-over" style={{ display: 'none' }}>
					<div className="game-over-content">
						<h3>Game Over!</h3>
						<p>Final Score: <span id="final-score">0</span></p>
						<button className="falling-blocks-og-btn falling-blocks-og-btn-restart" data-action="restart">Play Again</button>
					</div>
				</div>
			</div>
		</div>
	);
}
	