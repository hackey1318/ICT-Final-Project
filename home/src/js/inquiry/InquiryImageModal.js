import PropTypes from 'prop-types';
import '../../css/inquiry/inquiry.css';
import left from '../../img/arrowL.jpg';
import right from '../../img/arrowR.jpg';
import close from '../../img/close.jpg';
import { useCallback, useEffect, useState } from 'react';

const IMAGE_BASE_URL = 'http://localhost:9988/file-system/showImage/';

function InquiryImageModal({ images, initialIndex, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const toNext = useCallback(() => {
        if(!images || images.length === 0) return null;
        const nextIndex = (currentIndex+1)%images.length;
        setCurrentIndex(nextIndex);
    }, [currentIndex, images.length]);

    const toPrev = useCallback(() => {
        if(images.length === 0) return null;
        const prevIndex = (currentIndex-1+images.length)%images.length;
        setCurrentIndex(prevIndex);
    }, [currentIndex, images.length]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if(event.key === 'Escape') {
                onClose();
            } else if(event.key === 'ArrowLeft') {
                toPrev();
            } else if(event.key === 'ArrowRight') {
                toNext();
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [onClose, toPrev, toNext]);

    if(!images || images.length === 0) {
        return null;
    }

    const currentImageSrc = `${IMAGE_BASE_URL}${images[currentIndex]}`;

    // const handleOverlayClick = (e) => {
    //     if(e.target === e.currentTarget) {
    //         onClose();
    //     }
    // };

    return (
        <div className="inquiry-modal-overlay">
            <img src={close} id="modal-close" onClick={onClose}/>
            <div style={{textAlign: 'center', display: 'flex', justifyContent: 'space-between'}}>
                <div style={{width: '10%', height: '580px', lineHeight: '600px'}}>
                    <img src={left} className='move-img' onClick={toPrev}/>
                </div>
                <div style={{width: '80%', height: '580px', lineHeight: '600px'}}>
                    <img src={currentImageSrc} style={{width: '90%', maxHeight: '500px', objectFit:'contain', borderRadius: '20px'}}/>
                </div>
                <div style={{width: '10%', height: '580px', lineHeight: '600px'}}>
                    <img src={right} className='move-img' onClick={toNext}/>
                </div>
            </div>
        </div>
    )
}

InquiryImageModal.propTypes = {
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    initialIndex: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default InquiryImageModal;
