import { useBlockProps } from '@wordpress/block-editor';
export default function save({ attributes }) {
	const { gameWidth, gameHeight, showControls } = attributes;
	const blockProps = useBlockProps.save();

	return (
		<div {...blockProps}>
			<div className="falling-blocks-container" data-width={gameWidth} data-height={gameHeight} data-show-controls={showControls}>
				<div className="falling-blocks-area">
					<canvas 
						className="falling-blocks-canvas" 
						width={gameWidth} 
						height={gameHeight}
					></canvas>
					<div className="falling-blocks-sidebar">
						<div className="falling-blocks-score-panel">
							<div className="score-item">
								<span className="label">Score:</span>
								<span className="value" id="falling-blocks-score">0</span>
							</div>
							<div className="score-item">
								<span className="label">Level:</span>
								<span className="value" id="falling-blocks-level">1</span>
							</div>
							<div className="score-item">
								<span className="label">Lines:</span>
								<span className="value" id="falling-blocks-lines">0</span>
							</div>
						</div>
						<div className="falling-blocks-next-piece">
							<div className="label">Next:</div>
							<canvas className="next-piece-canvas" width="80" height="80"></canvas>
						</div>
					</div>
				</div>
				{showControls && (
					<div className="falling-blocks-controls">
						<div className="control-row">
							<button className="falling-blocks-btn" data-action="rotate">↻</button>
						</div>
						<div className="control-row">
							<button className="falling-blocks-btn" data-action="left">←</button>
							<button className="falling-blocks-btn" data-action="down">↓</button>
							<button className="falling-blocks-btn" data-action="right">→</button>
						</div>
						<div className="control-row">
							<button className="falling-blocks-btn falling-blocks-btn-wide" data-action="drop">DROP</button>
						</div>
						<div className="control-row">
							<button className="falling-blocks-btn falling-blocks-btn-restart" data-action="restart">RESTART</button>
						</div>
					</div>
				)}
				<div className="falling-blocks-over" style={{ display: 'none' }}>
					<div className="game-over-content">
						<h3>Game Over!</h3>
						<p>Final Score: <span id="final-score">0</span></p>
						<button className="falling-blocks-btn falling-blocks-btn-restart" data-action="restart">Play Again</button>
					</div>
				</div>
			</div>
		</div>
	);
}
	