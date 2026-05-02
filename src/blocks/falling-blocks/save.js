import { useBlockProps } from '@wordpress/block-editor';
export default function save({ attributes }) {
	const {} = attributes;
	const blockProps = useBlockProps.save();

	return (
		<div {...blockProps}>
			
		</div>
	);
}
	