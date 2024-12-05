package org.noisevisionproductions.portfolio.cache.model.project;

import org.junit.jupiter.api.Test;
import org.noisevisionproductions.portfolio.projectsManagement.model.ImageFromProject;

import static org.junit.jupiter.api.Assertions.*;

class CacheableImageTest {

    @Test
    void shouldCorrectlyConvertFromImageToCacheableImage() {
        ImageFromProject image = new ImageFromProject();
        image.setId(1L);
        image.setImageUrl("test-image.jpg");
        image.setCaption("Test Caption");

        CacheableImage cacheableImage = CacheableImage.fromImage(image);

        assertNotNull(cacheableImage);
        assertEquals(1L, cacheableImage.getId());
        assertEquals("test-image.jpg", cacheableImage.getImageUrl());
        assertEquals("Test Caption", cacheableImage.getCaption());
    }

    @Test
    void shouldCorrectlyConvertCacheableImageToImage() {
        CacheableImage cacheableImage = new CacheableImage();
        cacheableImage.setId(2L);
        cacheableImage.setImageUrl("another-image.png");
        cacheableImage.setCaption("Another Caption");

        ImageFromProject image = cacheableImage.toEntity();

        assertNotNull(image);
        assertEquals(2L, image.getId());
        assertEquals("another-image.png", image.getImageUrl());
        assertEquals("Another Caption", image.getCaption());
    }

    @Test
    void shouldCreateImageWithEmptyFields() {
        CacheableImage cacheableImage = new CacheableImage();

        ImageFromProject image = cacheableImage.toEntity();

        assertNotNull(image);
        assertNull(image.getId());
        assertNull(image.getImageUrl());
        assertNull(image.getCaption());
    }

    @Test
    void shouldCorrectlyUseAllArgsConstructor() {
        Long id = 3L;
        String imageUrl = "profile.jpg";
        String caption = "Profile Picture";

        CacheableImage cacheableImage = new CacheableImage(id, imageUrl, caption);

        assertEquals(id, cacheableImage.getId());
        assertEquals(imageUrl, cacheableImage.getImageUrl());
        assertEquals(caption, cacheableImage.getCaption());
    }

    @Test
    void shouldHandlePartiallyFilledImage() {
        ImageFromProject image = new ImageFromProject();
        image.setId(4L);
        image.setImageUrl("partial-image.jpg");

        CacheableImage cacheableImage = CacheableImage.fromImage(image);

        assertNotNull(cacheableImage);
        assertEquals(4L, cacheableImage.getId());
        assertEquals("partial-image.jpg", cacheableImage.getImageUrl());
        assertNull(cacheableImage.getCaption());
    }

    @Test
    void shouldRetainDataTypesAfterConversion() {
        Long originalId = 5L;
        CacheableImage cacheableImage = new CacheableImage(originalId, "test.jpg", "Test");

        ImageFromProject image = cacheableImage.toEntity();
        CacheableImage convertedBack = CacheableImage.fromImage(image);

        assertNotNull(convertedBack.getId());
        assertEquals(originalId, convertedBack.getId());
        assertEquals(cacheableImage.getImageUrl(), convertedBack.getImageUrl());
        assertEquals(cacheableImage.getCaption(), convertedBack.getCaption());
    }
}